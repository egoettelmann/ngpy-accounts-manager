import datetime
from datetime import date
from typing import List, Optional

from ..models import Transaction, KeyValue, CompositeKeyValue, PeriodType
from ...dbconnector.entities import QKeyValue, QCompositeKeyValue
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

    def get_all_transactions(self,
                             account_ids: List[int] = None,
                             year: int = None,
                             month: int = None,
                             label_ids: List[int] = None,
                             description: str = None
                             ) -> List[Transaction]:
        """Gets a list of transactions matching the provided filters.

        :param account_ids: the accounts ids
        :param year: the year
        :param month: the month
        :param label_ids: the label ids
        :param description: the description
        :return: the list of transactions
        """
        date_from = self.get_date_from(year, month)
        date_to = self.get_date_to(year, month)
        labels = self.sanitize_label_ids(label_ids)
        return self.__mapper.map_all(
            self.__repository.get_all(account_ids, date_from, date_to, labels, description),
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

    def count(self, label_id: int = None) -> int:
        """Counts the number of transaction for a given label.

        :param label_id: the label id
        :return: the number of transactions
        """
        return self.__repository.count(label_id)

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

    def get_top_transactions(self,
                             num_transactions: int,
                             ascending: bool,
                             account_ids: List[int],
                             year: int,
                             month: int,
                             label_ids: List[int]
                             ) -> List[Transaction]:
        """Gets the list of top transactions by their amount.
        If 'ascending' is true, gets the transactions with the biggest amounts.
        If 'ascending' is false, gets the transactions with the lowest amounts.

        :param num_transactions: the number of transactions to get
        :param ascending: the order
        :param account_ids: the account ids
        :param year: the year
        :param month: the month
        :param label_ids: the label ids
        :return: the list of transactions
        """
        date_from = self.get_date_from(year, month)
        date_to = self.get_date_to(year, month)
        return self.__mapper.map_all(
            self.__repository.get_top_transactions(
                num_transactions,
                ascending,
                account_ids,
                date_from,
                date_to,
                label_ids
            ),
            Transaction
        )

    def get_total_by_labels(self,
                            account_ids: List[int] = None,
                            year: int = None,
                            month: int = None,
                            sign: bool = None
                            ) -> List[KeyValue]:
        """Gets the total by labels matching the provided filters.

        :param account_ids: the account ids
        :param year: the year
        :param month: the month
        :param sign: the sign
        :return: the list of (key, value) results
        """
        date_from = self.get_date_from(year, month)
        date_to = self.get_date_to(year, month)
        return self.map_to_key_value_list(
            self.__repository.get_grouped_by_labels(account_ids, date_from, date_to, sign)
        )

    def get_total_by_period(self,
                            account_ids: List[int] = None,
                            year: int = None,
                            month: int = None,
                            period: str = None,
                            label_ids: List[int] = None,
                            sign: bool = None
                            ) -> List[KeyValue]:
        """Gets the total by period matching the provided filters.

        :param account_ids: the account ids
        :param year: the year
        :param month: the month
        :param period: the period
        :param label_ids: the label ids
        :param sign: the sign
        :return: the list of (key, value) results
        """
        date_from = self.get_date_from(year, month)
        date_to = self.get_date_to(year, month)
        entries = self.__repository.get_grouped_by_period(account_ids, date_from, date_to, period, label_ids, sign)
        values = []
        for kv in entries:
            keys = str(kv.key).split('-')
            key = keys[0]
            if period in [PeriodType.MONTH, PeriodType.DAY]:
                key = key + '-' + keys[1]
            if period in [PeriodType.DAY]:
                key = key + '-' + keys[2]
            values.append(KeyValue(key, kv.value))
        return values

    def get_total_by_category_type(self,
                                   account_ids: List[int] = None,
                                   year: int = None,
                                   category_type: str = None,
                                   quarterly: bool = True
                                   ) -> List[CompositeKeyValue]:
        """Gets the total by category type matching the provided filters.

        :param account_ids: the account ids
        :param year: the year
        :param category_type: the category type
        :param quarterly: the quarterly filter flag
        :return: the list of (key_one, key_two, value) results
        """
        date_from = self.get_date_from(year)
        date_to = self.get_date_to(year)
        return self.map_to_grouped_value_list(
            self.__repository.get_grouped_by_category_type(account_ids, date_from, date_to, category_type, quarterly)
        )

    def get_total_by_labels_and_category_type(self,
                                              account_ids: List[int] = None,
                                              year: int = None,
                                              category_type: str = None
                                              ) -> List[CompositeKeyValue]:
        """Gets the total by labels and category type matching the provided filters.

        :param account_ids: the account ids
        :param year: the year
        :param category_type: the category type
        :return: the list of (key_one, key_two, value) results
        """
        date_from = self.get_date_from(year)
        date_to = self.get_date_to(year)
        return self.map_to_grouped_value_list(
            self.__repository.get_grouped_by_labels_and_category_type(account_ids, date_from, date_to, category_type)
        )

    def get_total(self,
                  account_ids: List[int] = None,
                  year: int = None,
                  month: int = None,
                  sign: bool = None,
                  label_ids: List[int] = None
                  ) -> float:
        """Gets the total transactions matching the provided filters.

        :param account_ids: the account ids
        :param year: the year
        :param month: the month
        :param sign: the sign
        :param label_ids: the label ids
        :return: the total
        """
        date_from = self.get_date_from(year, month)
        date_to = self.get_date_to(year, month)
        return self.__repository.get_total(account_ids, date_from, date_to, sign, label_ids)

    def create_one(self, transaction: Transaction) -> Transaction:
        """Creates a transaction.

        :param transaction: the transaction to create
        :return: the created transaction
        """
        return self.__repository.save_one(
            self.__mapper.map(
                transaction,
                TransactionDbo
            )
        )

    def create_all(self, transactions) -> bool:
        """Creates all provided transactions.

        :param transactions: the transactions to create
        :return: if the creation was successful or not
        """
        # FIXME: should use domain model !
        return self.__repository.create_all(transactions)

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
    def get_date_from(year: int = None, month: int = None) -> date:
        """Gets a start date from a given year and month.
        Will be the first day of the provided month.

        :param year: the year
        :param month: the month
        :return: the start date
        """
        date_from = datetime.date(1900, 1, 1)
        if year is not None:
            date_from = date_from.replace(year=year)
        if month is not None:
            date_from = date_from.replace(month=month)
        return date_from

    @staticmethod
    def get_date_to(year: int = None, month: int = None) -> date:
        """Gets an end date from a given year and month.
        Will be the first day after the provided month.

        :param year: the year
        :param month: the month
        :return: the end date
        """
        date_to = datetime.date(datetime.date.today().year + 1, 1, 1)
        if year is not None:
            date_to = date_to.replace(year=year+1)
        else:
            year = datetime.date.today().year
        if month is not None:
            if month > 11:
                date_to = date_to.replace(year=year+1)
                date_to = date_to.replace(month=1)
            else:
                date_to = date_to.replace(year=year)
                date_to = date_to.replace(month=month+1)
        return date_to

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
    def map_to_key_value_list(entries: List[QKeyValue]) -> List[KeyValue]:
        """Maps a list of (key, value) results.

        :param entries: the list of results to map
        :return: the mapped list
        """
        values = []
        for kv in entries:
            values.append(KeyValue(kv.key, kv.value))
        return values

    @staticmethod
    def map_to_grouped_value_list(entries: List[QCompositeKeyValue]) -> List[CompositeKeyValue]:
        """Maps a list of (key_one, key_two, value) results.

        :param entries: the list of results to map
        :return: the mapped list
        """
        values = []
        for kv in entries:
            values.append(CompositeKeyValue(kv.key_one, kv.key_two, kv.value))
        return values
