import datetime

from .label import LabelService
from ..models import Transaction, KeyValue, GroupedValue
from ...dbconnector.repositories.transaction import TransactionRepository
from ...mapping import Mapper


class TransactionService():
    repository : TransactionRepository
    mapper : Mapper

    def __init__(self,
                 transaction_repository : TransactionRepository,
                 object_mapper : Mapper
                 ) -> None : ...

    def get_all_transactions(self,
                             account_ids : list(int),
                             year : int,
                             month : int) -> list(Transaction) : ...

    def get_transaction(self, transaction_id : int) -> Transaction : ...

    def count(self, label_id : int) -> int : ...

    def delete_transaction(self, transaction_id : int) -> None : ...

    def get_last_transaction(self, account_ids : list(int)) -> Transaction : ...

    def get_top_transactions(self,
                             num_transactions : int,
                             ascending : bool,
                             account_ids : list(int),
                             year : int,
                             month : int
                             ) -> Transaction : ...

    def get_total_by_labels(self,
                            account_ids : list(int),
                            year : int,
                            month : int,
                            sign : bool
                            ) -> KeyValue : ...

    def get_total_by_period(self,
                            account_ids : list(int),
                            year : int,
                            month : int,
                            period : str
                            ) -> KeyValue : ...

    def get_total_by_category_type(self,
                                   account_ids : list(int),
                                   year : int,
                                   category_type : str
                                   ) -> GroupedValue : ...

    def get_total_by_labels_and_category_type(self,
                                              account_ids : list(int),
                                              year : int,
                                              category_type : str
                                              ) -> GroupedValue : ...

    def get_total(self,
                  account_ids : list(int),
                  year : int,
                  month : int,
                  sign : bool) -> float : ...

    def create_all(self, transactions : list(Transaction)) -> bool : ...

    def update_one(self, transaction : Transaction) -> bool : ...

    @staticmethod
    def get_date_from(year : int, month : int) -> datetime.date : ...

    @staticmethod
    def get_date_to(year : int, month : int) -> datetime.date : ...

    @staticmethod
    def map_to_key_value_list(entries : list(any)) -> list(KeyValue) : ...

    @staticmethod
    def map_to_grouped_value_list(entries : list(any)) -> list(GroupedValue) : ...
