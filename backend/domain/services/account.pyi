import datetime

from .status import StatusService
from .transaction import TransactionService
from ..importers.resolve import Resolver
from ..models import Account, Notification
from ...dbconnector.repositories.account import AccountRepository
from ...mapping import Mapper


class AccountService():
    repository : AccountRepository
    mapper : Mapper
    transaction_service : TransactionService
    status_service : StatusService
    resolver: Resolver

    def __init__(self,
                 account_repository : AccountRepository,
                 object_mapper : Mapper,
                 transaction_service : TransactionService,
                 status_service : StatusService,
                 resolver: Resolver
                 ) -> None : ...

    def get_all_accounts(self) -> list(Account) : ...

    def get_account(self, account_id : int) -> Account : ...

    def find_by_name(self, name : str) -> Account : ...

    def delete_account(self, account_id : int) -> None : ...

    def save_account(self, account : Account) -> None : ...

    def get_last_update(self, account_id : int) -> datetime.date : ...

    def get_account_total(self, account_id : int, date : datetime.date) -> float : ...

    def import_file(self, filename : str) -> bool : ...

    def get_notification_levels(self) -> (str, list(Notification)) : ...
