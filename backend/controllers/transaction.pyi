from ..domain.models import Transaction
from ..domain.services.transaction import TransactionService
from ..domain.services.account import AccountService


class TransactionController():
    transaction_service : TransactionService
    account_service : AccountService

    def __init__(self,
                 transaction_service : TransactionService,
                 account_service : AccountService) -> None : ...

    @staticmethod
    def allowed_file(filename) -> bool : ...

    def get_all(self) -> list(Transaction) : ...

    def get_top_transactions(self,
                             num_transactions : int,
                             ascending : str
                             ) -> list(Transaction) : ...

    def upload_file(self) -> bool : ...

    def update_one(self) -> bool : ...
