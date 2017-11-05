import datetime

from sqlalchemy.orm.query import Query

from ..entities import TransactionDbo
from ..manager import EntityManager


class QKeyValue:
    label: str
    value: float


class TransactionRepository():
    query : Query
    entity_manager : EntityManager

    def __init__(self, entity_manager : EntityManager) -> None : ...

    def get_all(self,
                account_ids : list(int),
                date_from : datetime.date,
                date_to : datetime.date
                ) -> list(TransactionDbo) : ...

    def get_by_id(self, transaction_id : int) -> TransactionDbo : ...

    def get_grouped_by_labels(self,
                              account_ids : list(int),
                              date_from : datetime.date,
                              date_to : datetime.date,
                              sign : bool
                              ) -> QKeyValue : ...

    def get_grouped_by_period(self,
                              account_ids : list(int),
                              date_from : datetime.date,
                              date_to : datetime.date,
                              period : str
                              ) -> QKeyValue : ...

    def get_total(self,
                  account_ids : list(int),
                  date_from : datetime.date,
                  date_to : datetime.date,
                  sign : bool
                  ) -> float : ...

    @staticmethod
    def filter_by_accounts(query : Query, account_ids : list(int)) -> Query : ...

    @staticmethod
    def filter_by_date_from(query : Query, date_from : datetime.date) -> Query : ...

    @staticmethod
    def filter_by_date_to(query : Query, date_to : datetime.date) -> Query : ...

    @staticmethod
    def filter_by_labels(query : Query, label_ids : list(int)) -> Query : ...

    @staticmethod
    def filter_by_sign(query : Query, sign : bool) -> Query : ...
