import datetime
import hashlib
from typing import List, Optional

from ..exceptions import DuplicateElementsException
from ..models import Transaction, KeyValue, CompositeKeyValue, PeriodType
from ..search_request import SearchRequest, FilterRequest
from ...dbconnector.entities import TransactionDbo
from ...dbconnector.repositories import TransactionRepository
from ...mapping import Mapper
from ...modules.depynject import injectable


@injectable()
class TransactionService:
    """
    The transaction service class that defines all business operations.
    """

    def __init__(self,
                 transaction_repository: TransactionRepository,
                 object_mapper: Mapper
                 ) -> None:
        """Constructor

        :param transaction_repository: the transaction repository
        :param object_mapper: the object mapper
        """
        self.__repository = transaction_repository
        self.__mapper = object_mapper

    def search_all(self, search_request: SearchRequest) -> List[Transaction]:
        """Gets a list of transactions matching the provided filters.

        :param search_request: the search request
        :return: the list of transactions
        """
        return self.__mapper.map_all(
            self.__repository.find_all(search_request),
            Transaction
        )

    def get_transaction(self, transaction_id: int):
        """Gets a transaction by its id.

        :param transaction_id: the transaction id
        :return: the transaction
        """
        return self.__mapper.map(
            self.__repository.get_by_id(transaction_id),
            Transaction
        )

    def count(self, filter_request: FilterRequest) -> int:
        """Counts the number of transaction for a given label.

        :param filter_request: the filter request
        :return: the number of transactions
        """
        return self.__repository.count(filter_request)

    def delete_transaction(self, transaction_id: int) -> None:
        """Deletes a transaction by its id.

        :param transaction_id: the transaction id
        """
        self.__repository.delete_by_id(transaction_id)

    def get_last_transaction(self, account_ids: List[int]) -> Transaction:
        """Gets the last transaction for a given list of accounts.

        :param account_ids: the account ids
        :return: the last transaction
        """
        return self.__mapper.map(
            self.__repository.get_last_transaction(account_ids),
            Transaction
        )

    def get_total_by_labels(self, filter_request: FilterRequest) -> List[KeyValue]:
        """Gets the total by labels matching the provided filters.

        :param filter_request: the filter request
        :return: the list of (key, value) results
        """
        entries = self.__repository.get_grouped_by_labels(filter_request)
        values = []
        for kv in entries:
            values.append(KeyValue(kv.key, kv.value))
        return values

    def get_total_over_period(self,
                              period: PeriodType,
                              filter_request: FilterRequest
                              ) -> List[KeyValue]:
        """Gets the total by period matching the provided filters.

        :param period: the period
        :param filter_request: the filter request
        :return: the list of (key, value) results
        """
        entries = self.__repository.get_grouped_over_period(period, filter_request)
        values = []
        for kv in entries:
            values.append(KeyValue(kv.key, kv.value))
        return values

    def get_total_by_category_over_period(self,
                                          period: PeriodType,
                                          filter_request: FilterRequest
                                          ) -> List[CompositeKeyValue]:
        """Gets the total by category type and period matching the provided filters.

        :param period: the period
        :param filter_request: the filter request
        :return: the list of (key_one, key_two, value) results
        """
        entries = self.__repository.get_grouped_by_category_over_period(period, filter_request)
        values = []
        for kv in entries:
            values.append(CompositeKeyValue(kv.key_one, kv.key_two, kv.value))
        return values

    def get_total_by_label_over_period(self,
                                       period: PeriodType,
                                       filter_request: FilterRequest
                                       ) -> List[CompositeKeyValue]:
        """Gets the total by label and period matching the provided filters.

        :param period: the period
        :param filter_request: the filter request
        :return: the list of (key_one, key_two, value) results
        """
        entries = self.__repository.get_grouped_by_label_over_period(period, filter_request)
        values = []
        for kv in entries:
            values.append(CompositeKeyValue(kv.key_one, kv.key_two, kv.value))
        return values

    def get_total_by_labels_and_type(self,
                                     filter_request: FilterRequest
                                     ) -> List[CompositeKeyValue]:
        """Gets the total by labels and category type matching the provided filters.

        :param filter_request: the filter request
        :return: the list of (key_one, key_two, value) results
        """
        entries = self.__repository.get_grouped_by_labels_and_type(filter_request)
        values = []
        for kv in entries:
            values.append(CompositeKeyValue(kv.key_one, kv.key_two, kv.value))
        return values

    def get_total(self, filter_request: FilterRequest) -> float:
        """Gets the total transactions matching the provided filters.

        :param filter_request: the filter request
        :return: the total
        """
        return self.__repository.get_total(filter_request)

    def create_one(self, transaction: Transaction) -> Transaction:
        """Creates a transaction.

        :param transaction: the transaction to create
        :return: the created transaction
        """
        dbo = self.__mapper.map(
            transaction,
            TransactionDbo
        )
        dbo.hash = self.calculate_digest(dbo)
        dbo.create_datetime = datetime.datetime.now()
        return self.__repository.save_one(dbo)

    def create_all(self, transactions: List[Transaction]) -> None:
        """Creates all provided transactions.

        :param transactions: the transactions to create
        :return: if the creation was successful or not
        """
        create_datetime = datetime.datetime.now()
        dbos = []
        digests = set()
        for transaction in transactions:
            dbo = self.__mapper.map(transaction, TransactionDbo)
            dbo.create_datetime = create_datetime
            dbo.hash = self.calculate_digest(dbo)
            if dbo.hash in digests:
                raise DuplicateElementsException("Same transaction appears twice in provided list", vars(transaction))
            digests.add(dbo.hash)
            dbos.append(dbo)
        self.__repository.create_all(dbos)

    def update_one(self, transaction: Transaction) -> Transaction:
        """Updates a transaction.

        :param transaction: the transaction to update
        :return: the updated transaction
        """
        return self.__repository.save_one(
            self.__mapper.map(
                transaction,
                TransactionDbo
            )
        )

    @staticmethod
    def sanitize_label_ids(label_ids: List[int] = None) -> Optional[List[int]]:
        """Sanitizes a list of label ids.
        Transforms 'null' to None.

        :param label_ids: the label ids
        :return: the sanitized label ids
        """
        if label_ids is not None:
            labels = []
            for label_id in label_ids:
                if label_id == 'null':
                    labels.append(None)
                else:
                    labels.append(label_id)
            return labels
        return None

    @staticmethod
    def calculate_digest(transaction: Transaction) -> str:
        """Calculates a digest for the given transaction.
        It should be able to identify uniquely a transaction.
        The digest takes into account:
          - the account_id
          - the reference
          - the date_value
          - the amount

        :param transaction: the transaction
        :return: the hash
        """
        s = str(transaction.account_id) \
            + transaction.reference \
            + transaction.date_value.strftime("%Y-%m-%d") \
            + "{0:.2f}".format(transaction.amount)
        return hashlib.md5(s.encode('utf-8')).hexdigest()
