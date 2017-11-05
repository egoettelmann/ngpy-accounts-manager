from ..domain.models import Account
from ..domain.services.account import AccountService


class AccountController():
    account_service : AccountService

    def __init__(self, account_service : AccountService) -> None : ...

    def get_all(self) -> list(Account) : ...

    def get_one(self, account_id : int) -> Account : ...