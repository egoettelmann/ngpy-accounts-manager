from ..domain.models import Transaction
from ..domain.services.transaction import TransactionService


class TransactionController():
    transaction_service : TransactionService

    def __init__(self, transaction_service : TransactionService) -> None : ...

    def get_all(self) -> list(Transaction) : ...
