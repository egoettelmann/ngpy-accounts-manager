from ..models import Summary
from .transaction import TransactionService
from .account import AccountService
from ...mapping import Mapper

class StatisticsService():
    mapper : Mapper
    transaction_service : TransactionService
    account_service : AccountService

    def __init__(self,
                 object_mapper : Mapper,
                 transaction_service : TransactionService,
                 account_service : AccountService) -> None : ...

    def get_summary(self,
                    account_ids : list(int),
                    year : int,
                    month : int,
                    label_ids : list(int)
                    ) -> Summary : ...
