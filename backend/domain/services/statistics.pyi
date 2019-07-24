from .account import AccountService
from .transaction import TransactionService
from ..models import Summary, KeyValue
from ...mapping import Mapper


class StatisticsService():
    mapper : Mapper
    transaction_service : TransactionService
    account_service : AccountService

    def __init__(self,
                 object_mapper : Mapper,
                 transaction_service : TransactionService,
                 account_service : AccountService) -> None : ...

    def get_aggregation_by_period(self,
                                  account_ids : list(int),
                                  year : int,
                                  month : int,
                                  label_ids : list(int),
                                  sign : bool
                                  ) -> list(KeyValue) : ...

    def get_evolution_for_year(self,
                               account_ids : list(int),
                               year : int
                               ) -> list(KeyValue) : ...

    def get_summary(self,
                    account_ids : list(int),
                    year : int,
                    month : int,
                    label_ids : list(int)
                    ) -> Summary : ...
