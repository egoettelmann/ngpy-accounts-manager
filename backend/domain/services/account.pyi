import datetime

from .status import StatusService
from .transaction import TransactionService
from ..models import Account, KeyValue
from ...dbconnector.repositories.account import AccountRepository
from ...mapping import Mapper


class AccountService():
    repository : AccountRepository
    mapper : Mapper
    transaction_service : TransactionService
    status_service : StatusService

    def __init__(self,
                 account_repository : AccountRepository,
                 object_mapper : Mapper,
                 transaction_service : TransactionService,
                 status_service : StatusService) -> None : ...

    def get_all_accounts(self) -> list(Account) : ...

    def get_account(self, account_id : int) -> Account : ...

    def get_account_total(self, account_id : int, date : datetime.date) -> float : ...

    def get_evolution_for_year(self, account_ids : list(int), year : int) -> list(KeyValue) : ...
