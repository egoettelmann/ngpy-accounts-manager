from ..domain.models import KeyValue, Summary, GroupedValue
from ..domain.services.account import AccountService
from ..domain.services.statistics import StatisticsService
from ..domain.services.transaction import TransactionService


class StatisticsController():
    statistics_service : StatisticsService
    account_service : AccountService
    transaction_service : TransactionService

    def __init__(self,
                 statistics_service : StatisticsService,
                 account_service : AccountService,
                 transaction_service : TransactionService) -> None : ...

    def get_repartition(self) -> list(KeyValue) : ...

    def get_treasury(self) -> list(KeyValue) : ...

    def get_summary(self) -> Summary : ...

    def get_analytics(self) -> list(GroupedValue) : ...
