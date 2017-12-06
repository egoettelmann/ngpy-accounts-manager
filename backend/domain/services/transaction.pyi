import datetime

from .label import LabelService
from ..models import Transaction, KeyValue
from ...dbconnector.repositories.transaction import TransactionRepository
from ...mapping import Mapper


class TransactionService():
    repository : TransactionRepository
    mapper : Mapper
    label_service : LabelService

    def __init__(self,
                 transaction_repository : TransactionRepository,
                 object_mapper : Mapper,
                 label_service : LabelService) -> None : ...

    def get_all_transactions(self,
                             account_ids : list(int),
                             year : int,
                             month : int) -> list(Transaction) : ...

    def get_transaction(self, transaction_id : int) -> Transaction : ...

    def get_total_by_labels(self,
                            account_ids : list(int),
                            year : int,
                            month : int,
                            sign : bool) -> KeyValue : ...

    def get_total_by_period(self,
                            account_ids : list(int),
                            year : int,
                            month : int,
                            period : str) -> KeyValue : ...

    def get_total(self,
                  account_ids : list(int),
                  year : int,
                  month : int,
                  sign : bool) -> float : ...

    def create_all(self,
                   transactions : list(Transaction)) -> bool : ...

    @staticmethod
    def get_date_from(year : int, month : int) -> datetime.date : ...

    @staticmethod
    def get_date_to(year : int, month : int) -> datetime.date : ...

    @staticmethod
    def map_to_key_value_list(entries : list(any)) -> list(KeyValue) : ...

    def create_from_csv(self, row : list(str)) -> Transaction : ...

    def create_from_csv2(self, row : list(str)) -> Transaction : ...

    def create_from_csv3(self, row : list(str)) -> Transaction : ...

    def create_from_csv4(self, row : list(str)) -> Transaction : ...
