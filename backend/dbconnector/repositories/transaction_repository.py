from typing import List

from sqlalchemy import cast, Integer, String
from sqlalchemy.sql.expression import extract, func, desc, label

from ..entities import LabelDbo, TransactionDbo, CategoryDbo, QKeyValue, QCompositeKeyValue
from ..manager import EntityManager
from ..query_builder import QueryBuilder
from ...domain.models import PeriodType
from ...domain.search_request import SearchRequest, FilterRequest
from ...modules.depynject import injectable


@injectable()
class TransactionRepository:
    """
    The transaction repository class that handles all database operations.
    """

    def __init__(self, entity_manager: EntityManager) -> None:
        """Constructor

        :param entity_manager: the entity manager
        """
        self.__entity_manager = entity_manager
        self.__query_builder = QueryBuilder(TransactionDbo)

    def get_by_id(self, transaction_id: int) -> TransactionDbo:
        """Gets a transaction by its id.

        :param transaction_id: the transaction id
        :return: the transaction
        """
        return self.__entity_manager.query(TransactionDbo).get(transaction_id)

    def find_all(self, search_request: SearchRequest) -> List[TransactionDbo]:
        """Gets all transactions matching the provided filters.

        :param search_request: the search request
        :return: the list of transactions
        """
        query = self.__entity_manager.query(TransactionDbo)
        query = self.__query_builder.build(
            query,
            filters=search_request.filter_request,
            sort=search_request.sort_request,
            paginate=search_request.page_request
        )
        return query.all()

    def count(self, filter_request: FilterRequest) -> TransactionDbo:
        """Counts the number transactions for a given label id.

        :param filter_request: the filter request
        :return: the number of transactions
        """
        query = self.__entity_manager.query(TransactionDbo)
        query = self.__query_builder.build(query, filters=filter_request)
        return query.count()

    def delete_by_id(self, transaction_id: int) -> None:
        """Deletes a transaction by its id.

        :param transaction_id: the transaction id
        """
        self.__entity_manager.query(TransactionDbo).filter(TransactionDbo.id == transaction_id).delete()
        try:
            self.__entity_manager.get_session().commit()
        except:
            self.__entity_manager.get_session().rollback()
            raise

    def get_last_transaction(self, account_ids: List[int]) -> TransactionDbo:
        """Gets the last transaction for a given list of accounts.

        :param account_ids: the account ids
        :return: the last transaction
        """
        query = self.__entity_manager.query(TransactionDbo)
        if account_ids is not None:
            query = query.filter(TransactionDbo.account_id.in_(account_ids))
        return query.order_by(desc(TransactionDbo.date_value)).first()

    def get_grouped_by_labels(self, filter_request: FilterRequest) -> List[QKeyValue]:
        """Gets the transaction amount grouped by labels matching the provided filters.

        :param filter_request: the filter request
        :return: the list of (key, value) results
        """
        value_expr = func.sum(TransactionDbo.amount)
        query = self.__entity_manager.query(
            label('key', LabelDbo.name),
            label('value', value_expr)
        ).join(
            LabelDbo.transactions
        )
        query = self.__query_builder.build(query, filters=filter_request)
        query = query.group_by(LabelDbo.id)
        query = query.group_by(LabelDbo.name)
        query = query.order_by(desc(value_expr))
        return query.all()

    def get_grouped_over_period(self,
                                period: PeriodType,
                                filter_request: FilterRequest
                                ) -> List[QKeyValue]:
        """Gets the transaction amount grouped by period matching the provided filters.

        :param period: the period
        :param filter_request: the filter request
        :return: the list of (key, value) results
        """
        period_expr = self.period_expression(period, TransactionDbo.date_value)
        query = self.__entity_manager.query(
            label('key', period_expr),
            label('value', func.sum(TransactionDbo.amount))
        )
        query = self.__query_builder.build(query, filters=filter_request)
        query = query.group_by(period_expr)
        query = query.order_by(period_expr)
        return query.all()

    def get_grouped_by_type_over_period(self,
                                        period: PeriodType,
                                        filter_request: FilterRequest
                                        ) -> List[QCompositeKeyValue]:
        """Gets the transaction amount grouped by category type and period matching the provided filters.

        :param period: the period
        :param filter_request: the filter request
        :return: the list of (key_one, key_two, value) results
        """
        period_expr = self.period_expression(period, TransactionDbo.date_value)
        query = self.__entity_manager.query(
            label('key_one', period_expr),
            label('key_two', CategoryDbo.name),
            label('value', func.sum(TransactionDbo.amount))
        ).join(
            CategoryDbo.labels
        ).join(
            LabelDbo.transactions
        )
        query = self.__query_builder.build(query, filters=filter_request)
        query = query.group_by(CategoryDbo.name)
        query = query.group_by(period_expr)
        return query.all()

    def get_grouped_by_labels_and_type(self, filter_request: FilterRequest) -> List[QCompositeKeyValue]:
        """Gets the transaction amount grouped by category and label matching the provided filters.

        :param filter_request: the filter request
        :return: the list of (key_one, key_two, value) results
        """
        query = self.__entity_manager.query(
            label('key_one', CategoryDbo.name),
            label('key_two', LabelDbo.name),
            label('value', func.sum(TransactionDbo.amount))
        ).join(
            CategoryDbo.labels
        ).join(
            LabelDbo.transactions
        )
        query = self.__query_builder.build(query, filters=filter_request)
        query = query.group_by(LabelDbo.id)
        query = query.group_by(CategoryDbo.name)
        return query.all()

    def get_total(self, filter_request: FilterRequest) -> float:
        """Gets the total of all transaction matching the provided filters.

        :param filter_request: the filter request
        :return: the total
        """
        query = self.__entity_manager.query(
            label('total', func.sum(TransactionDbo.amount))
        )
        query = self.__query_builder.build(query, filters=filter_request)
        total = query.scalar()
        return 0 if total is None else total

    def create_all(self, transactions: List[TransactionDbo]) -> bool:
        """Creates a provided list of transactions in database

        :param transactions: the list of transactions
        :return: if the creation was successful
        """
        for transaction in transactions:
            self.__entity_manager.get_session().add(transaction)
        try:
            self.__entity_manager.get_session().commit()
        except:
            self.__entity_manager.get_session().rollback()
            raise
        return True

    def save_one(self, transaction: TransactionDbo) -> TransactionDbo:
        """Saves a transaction (create and update).

        :param transaction: the transaction to save
        :return: the saved transaction
        """
        saved_transaction = self.__entity_manager.get_session().merge(transaction)
        try:
            self.__entity_manager.get_session().commit()
        except:
            self.__entity_manager.get_session().rollback()
            raise
        self.__entity_manager.get_session().refresh(saved_transaction)
        return saved_transaction

    def period_expression(self, period: PeriodType, column: any) -> any:
        """Builds a period expression from a provided period type and for a given column.

        :param period: the period type
        :param column: the column
        :return: the period expression
        """
        if period == PeriodType.DAY:
            return cast(extract('year', column), String)\
                   + '-'\
                   + self.__entity_manager.query_adapter.pad(extract('month', column), '00')\
                   + '-'\
                   + self.__entity_manager.query_adapter.pad(extract('day', column), '00')
        if period == PeriodType.MONTH:
            return cast(extract('year', column), String)\
                   + '-'\
                   + self.__entity_manager.query_adapter.pad(extract('month', column), '00')
        if period == PeriodType.QUARTER:
            return cast(extract('year', column), String)\
                   + '-Q'\
                   + cast(cast((extract('month', TransactionDbo.date_value) + 2) / 3, Integer), String)
        if period == PeriodType.YEAR:
            return cast(extract('year', column), String)
