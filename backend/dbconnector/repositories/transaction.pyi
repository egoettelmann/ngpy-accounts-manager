import datetime

from sqlalchemy.orm.query import Query

from ..entities import TransactionDbo
from ..manager import EntityManager


class QKeyValue:
    key: str
    value: float


class QCompositeKeyValue:
    key_one: str
    key_two: str
    value: float


class TransactionRepository():
    query : Query
    entity_manager : EntityManager

    def __init__(self, entity_manager : EntityManager) -> None : ...

    def get_all(self,
                account_ids : list(int),
                date_from : datetime.date,
                date_to : datetime.date,
                label_ids : list(int),
                description: str
                ) -> list(TransactionDbo) : ...

    def get_by_id(self, transaction_id : int) -> TransactionDbo : ...

    def count(self, label_id : int) -> int : ...

    def delete_by_id(self, transaction_id : int) -> None : ...

    def get_last_transaction(self, account_ids : list(int)) -> TransactionDbo : ...

    def get_top_transactions(self,
                             num_transactions : int,
                             ascending : bool,
                             account_ids : list(int),
                             date_from : datetime.date,
                             date_to : datetime.date,
                             label_ids : list(int)
                             ) -> list(TransactionDbo) : ...

    def get_grouped_by_labels(self,
                              account_ids : list(int),
                              date_from : datetime.date,
                              date_to : datetime.date,
                              sign : bool
                              ) -> list(QKeyValue) : ...

    def get_grouped_by_period(self,
                              account_ids : list(int),
                              date_from : datetime.date,
                              date_to : datetime.date,
                              period : str,
                              label_ids : list(int)
                              ) -> list(QKeyValue) : ...

    def get_grouped_by_category_type(self,
                                     account_ids : list(int),
                                     date_from : datetime.date,
                                     date_to : datetime.date,
                                     category_type : str,
                                     quarterly : bool
                                     ) -> list(QCompositeKeyValue) : ...

    def get_grouped_by_labels_and_category_type(self,
                                                account_ids : list(int),
                                                date_from : datetime.date,
                                                date_to : datetime.date,
                                                category_type : str
                                                ) -> list(QCompositeKeyValue) : ...

    def get_total(self,
                  account_ids : list(int),
                  date_from : datetime.date,
                  date_to : datetime.date,
                  sign : bool,
                  label_ids : list(int)
                  ) -> float : ...

    def create_all(self, transactions : list(TransactionDbo)) -> bool : ...

    def save_one(self, transaction : TransactionDbo) -> bool : ...

    @staticmethod
    def filter_by_accounts(query : Query, account_ids : list(int)) -> Query : ...

    @staticmethod
    def filter_by_date_from(query : Query, date_from : datetime.date) -> Query : ...

    @staticmethod
    def filter_by_date_to(query : Query, date_to : datetime.date) -> Query : ...

    @staticmethod
    def filter_by_labels(query : Query, label_ids : list(int)) -> Query : ...

    @staticmethod
    def filter_by_description(query : Query, description : str) -> Query : ...

    @staticmethod
    def filter_by_category_type(query : Query, category_type : str) -> Query : ...

    @staticmethod
    def filter_by_sign(query : Query, sign : bool) -> Query : ...
