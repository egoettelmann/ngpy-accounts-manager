import datetime

from sqlalchemy.orm.query import Query

from ..manager import EntityManager
from .transaction import TransactionRepository

from ..entities import AccountDbo


class AccountRepository():
    query : Query
    entity_manager : EntityManager
    transaction_repository : TransactionRepository

    def __init__(self, entity_manager : EntityManager, transaction_repository : TransactionRepository) -> None : ...

    def get_all(self) -> list(AccountDbo) : ...

    def get_by_id(self, account_id : int) -> AccountDbo : ...

    def get_total(self, account_id : int, date_from : datetime.date, date_to : datetime.date) -> float: ...

    def find_by_name(self, name : str) -> AccountDbo : ...
