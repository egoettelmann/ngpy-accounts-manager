from datetime import date
from typing import List

from sqlalchemy import cast, Integer
from sqlalchemy.orm import Query
from sqlalchemy.sql.expression import extract, func, desc, label, or_

from ..entities import LabelDbo, TransactionDbo, CategoryDbo, QKeyValue, QCompositeKeyValue
from ..manager import EntityManager
from ..query_builder import QueryBuilder
from ...domain.models import PeriodType
from ...domain.search_request import SearchRequest
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

    def get_all(self,
                account_ids: int = None,
                date_from: date = None,
                date_to: date = None,
                label_ids: List[int] = None,
                description: str = None
                ) -> List[TransactionDbo]:
        """Gets all transactions matching the provided filters.

        :param account_ids: the list of account ids
        :param date_from: the start date
        :param date_to: the end date
        :param label_ids: the list of label ids
        :param description: the description
        :return: the list of transactions
        """
        query = self.__entity_manager.query(TransactionDbo)
        query = self.filter_by_accounts(query, account_ids)
        query = self.filter_by_date_from(query, date_from)
        query = self.filter_by_date_to(query, date_to)
        query = self.filter_by_labels(query, label_ids)
        query = self.filter_by_description(query, description)
        return query.order_by(TransactionDbo.date_value).order_by(TransactionDbo.id).limit(500)

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
        query = self.__query_builder.filter(query, search_request.filter_request)
        query = self.__query_builder.sort(query, search_request.sort_request)
        query = self.__query_builder.paginate(query, search_request.page_request)
        return query.all()

    def count(self, label_id: int = None) -> TransactionDbo:
        """Counts the number transactions for a given label id.

        :param label_id: the label id
        :return: the number of transactions
        """
        query = self.__entity_manager.query(TransactionDbo)
        query = self.filter_by_labels(query, None if label_id is None else [label_id])
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
        query = self.filter_by_accounts(query, account_ids)
        return query.order_by(desc(TransactionDbo.date_value)).first()

    def get_top_transactions(self,
                             num_transactions: int,
                             ascending: bool,
                             account_ids: List[int] = None,
                             date_from: date = None,
                             date_to: date = None,
                             label_ids: List[int] = None
                             ) -> List[TransactionDbo]:
        """Gets the list of top transactions by their amount.
        If 'ascending' is true, gets the transactions with the biggest amounts.
        If 'ascending' is false, gets the transactions with the lowest amounts.

        :param num_transactions: the number of transactions to get
        :param ascending: the order
        :param account_ids: the account ids
        :param date_from: the start date
        :param date_to: the end date
        :param label_ids: the label ids
        :return: the list of transactions
        """
        query = self.__entity_manager.query(TransactionDbo)
        query = self.filter_by_accounts(query, account_ids)
        query = self.filter_by_date_from(query, date_from)
        query = self.filter_by_date_to(query, date_to)
        if ascending:
            query = query.order_by(TransactionDbo.amount)
        else:
            query = query.order_by(desc(TransactionDbo.amount))
        query = self.filter_by_labels(query, label_ids)
        return query.limit(num_transactions).all()

    def get_grouped_by_labels(self,
                              account_ids: List[int] = None,
                              date_from: date = None,
                              date_to: date = None,
                              sign: bool = None
                              ) -> List[QKeyValue]:
        """Gets the transaction amount grouped by labels matching the provided filters.

        :param account_ids: the list of account ids
        :param date_from: the start date
        :param date_to: the end date
        :param sign: the sign of the transaction
        :return: the list of (key, value) results
        """
        value_expr = func.sum(TransactionDbo.amount)
        query = self.__entity_manager.query(
            label('key', LabelDbo.name),
            label('value', value_expr)
        ).join(
            LabelDbo.transactions
        )
        query = self.filter_by_accounts(query, account_ids)
        query = self.filter_by_date_from(query, date_from)
        query = self.filter_by_date_to(query, date_to)
        query = self.filter_by_sign(query, sign)
        query = query.group_by(LabelDbo.id)
        query = query.group_by(LabelDbo.name)
        query = query.order_by(desc(value_expr))
        return query.all()

    def get_grouped_by_period(self,
                              account_ids: List[int] = None,
                              date_from: date = None,
                              date_to: date = None,
                              period: str = None,
                              label_ids: List[int] = None,
                              sign: bool = None
                              ) -> List[QKeyValue]:
        """Gets the transaction amount grouped by period matching the provided filters.

        :param account_ids: the list of account ids
        :param date_from: the start date
        :param date_to: the end date
        :param period: the period
        :param label_ids: the label ids
        :param sign: the sign of the transaction
        :return: the list of (key, value) results
        """
        query = self.__entity_manager.query(
            func.max(TransactionDbo.date_value).label('key'),
            func.sum(TransactionDbo.amount).label('value')
        )
        query = self.filter_by_accounts(query, account_ids)
        query = self.filter_by_date_from(query, date_from)
        query = self.filter_by_date_to(query, date_to)
        if period in [PeriodType.DAY]:
            query = query.group_by(extract('day', TransactionDbo.date_value))
            query = query.order_by(extract('day', TransactionDbo.date_value))
        if period in [PeriodType.MONTH, PeriodType.DAY]:
            query = query.group_by(extract('month', TransactionDbo.date_value))
            query = query.order_by(extract('month', TransactionDbo.date_value))
        if period in [PeriodType.YEAR, PeriodType.MONTH, PeriodType.DAY]:
            query = query.group_by(extract('year', TransactionDbo.date_value))
            query = query.order_by(extract('year', TransactionDbo.date_value))
        query = self.filter_by_labels(query, label_ids)
        query = self.filter_by_sign(query, sign)
        return query.all()

    def get_grouped_by_category_type(self,
                                     account_ids: List[int] = None,
                                     date_from: date = None,
                                     date_to: date = None,
                                     category_type: str = None,
                                     quarterly: bool = True
                                     ) -> List[QCompositeKeyValue]:
        """Gets the transaction amount grouped by category and period matching the provided filters.

        :param account_ids: the accounts ids
        :param date_from: the start date
        :param date_to: the end date
        :param category_type: the category type
        :param quarterly: if the results should be grouped by quarterly period
        :return: the list of (key_one, key_two, value) results
        """
        if quarterly:
            quarter_expr = cast((extract('month', TransactionDbo.date_value) + 2) / 3, Integer)
        else:
            quarter_expr = extract('month', TransactionDbo.date_value)
        query = self.__entity_manager.query(
            label('key_one', quarter_expr),
            label('key_two', CategoryDbo.name),
            label('value', func.sum(TransactionDbo.amount))
        ).join(
            CategoryDbo.labels
        ).join(
            LabelDbo.transactions
        )
        query = self.filter_by_accounts(query, account_ids)
        query = self.filter_by_date_from(query, date_from)
        query = self.filter_by_date_to(query, date_to)
        query = self.filter_by_category_type(query, category_type)
        query = query.group_by(CategoryDbo.name)
        query = query.group_by(quarter_expr)
        return query.all()

    def get_grouped_by_labels_and_category_type(self,
                                                account_ids: List[int] = None,
                                                date_from: date = None,
                                                date_to: date = None,
                                                category_type: str = None
                                                ) -> List[QCompositeKeyValue]:
        """Gets the transaction amount grouped by category and label matching the provided filters.

        :param account_ids: the account ids
        :param date_from: the start date
        :param date_to: the end date
        :param category_type: the category type
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
        query = self.filter_by_accounts(query, account_ids)
        query = self.filter_by_date_from(query, date_from)
        query = self.filter_by_date_to(query, date_to)
        query = self.filter_by_category_type(query, category_type)
        query = query.group_by(LabelDbo.id)
        query = query.group_by(CategoryDbo.name)
        return query.all()

    def get_total(self,
                  account_ids: List[int] = None,
                  date_from: date = None,
                  date_to: date = None,
                  sign: bool = None,
                  label_ids: List[int] = None
                  ) -> float:
        """Gets the total of all transaction matching the provided filters.

        :param account_ids: the account ids
        :param date_from: the start date
        :param date_to: the end date
        :param sign: the sign of the transaction
        :param label_ids: the label ids
        :return: the total
        """
        query = self.__entity_manager.query(
            label('total', func.sum(TransactionDbo.amount))
        )
        query = self.filter_by_accounts(query, account_ids)
        query = self.filter_by_date_from(query, date_from)
        query = self.filter_by_date_to(query, date_to)
        query = self.filter_by_sign(query, sign)
        query = self.filter_by_labels(query, label_ids)
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

    @staticmethod
    def filter_by_accounts(query: Query, account_ids: List[int] = None) -> Query:
        """Filters a query by account ids

        :param query: the query
        :param account_ids: the account ids
        :return: the filtered query
        """
        if account_ids is not None:
            query = query.filter(TransactionDbo.account_id.in_(account_ids))
        return query

    @staticmethod
    def filter_by_date_from(query: Query, date_from: date = None) -> Query:
        """Filters a query by start date.

        :param query: the query
        :param date_from: the start date
        :return: the filtered query
        """
        if date_from is not None:
            query = query.filter(
                TransactionDbo.date_value >= date_from
            )
        return query

    @staticmethod
    def filter_by_date_to(query: Query, date_to: date = None) -> Query:
        """Filters a query by and date.

        :param query: the query
        :param date_to: the end date
        :return: the filtered query
        """
        if date_to is not None:
            query = query.filter(
                TransactionDbo.date_value < date_to
            )
        return query

    @staticmethod
    def filter_by_labels(query: Query, label_ids: List[int] = None) -> Query:
        """Filters a query by label ids

        :param query: the query
        :param label_ids: the label ids
        :return: the filtered query
        """
        if label_ids is not None:
            if None in label_ids:
                query = query.filter(or_(
                    TransactionDbo.label_id.is_(None),
                    TransactionDbo.label_id.in_(label_ids)
                ))
            else:
                query = query.filter(TransactionDbo.label_id.in_(label_ids))
        return query

    @staticmethod
    def filter_by_reference(query: Query, reference: str = None) -> Query:
        """Filters a query by reference

        :param query: the query
        :param reference: the reference
        :return: the filtered query
        """
        if reference is not None:
            query = query.filter(TransactionDbo.reference == reference)
        return query

    @staticmethod
    def filter_by_description(query: Query, description: str = None) -> Query:
        """Filters a query by description

        :param query: the query
        :param description: the description
        :return: the filtered query
        """
        if description is not None:
            query = query.filter(TransactionDbo.description.ilike('%' + description + '%'))
        return query

    @staticmethod
    def filter_by_category_type(query: Query, category_type: str = None) -> Query:
        """Filters a query by category type

        :param query: the query
        :param category_type: the category type
        :return: the filtered query
        """
        if category_type is not None:
            query = query.filter(CategoryDbo.type == category_type)
        return query

    @staticmethod
    def filter_by_sign(query: Query, sign: bool = None) -> Query:
        """Filters a query by sign

        :param query: the query
        :param sign: the sign
        :return: the filtered query
        """
        if sign is False:
            query = query.filter(
                TransactionDbo.amount < 0
            )
        if sign is True:
            query = query.filter(
                TransactionDbo.amount >= 0
            )
        return query

    @staticmethod
    def filter_by_amount_min(query: Query, amount_min: int = None) -> Query:
        """Filters a query by a minimum amount

        :param query: the query
        :param amount_min: the minimum allowed amount
        :return: the filtered query
        """
        if amount_min is not None:
            query = query.filter(
                TransactionDbo.amount >= amount_min
            )
        return query

    @staticmethod
    def filter_by_amount_max(query: Query, amount_max: int = None) -> Query:
        """Filters a query by a maximum amount

        :param query: the query
        :param amount_max: the maximum allowed amount
        :return: the filtered query
        """
        if amount_max is not None:
            query = query.filter(
                TransactionDbo.amount < amount_max
            )
        return query
