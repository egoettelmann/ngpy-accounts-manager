import datetime
from typing import List, Optional

from .account_service import AccountService
from .transaction_service import TransactionService
from ..models import KeyValue
from ..models import PeriodType
from ..models import Summary
from ...mapping import Mapper
from ...modules.depynject import injectable


@injectable()
class StatisticsService:
    """
    The statistics service class that defines all business operations.
    """

    def __init__(self,
                 object_mapper: Mapper,
                 transaction_service: TransactionService,
                 account_service: AccountService
                 ) -> None:
        """Constructor

        :param object_mapper: the object mapper
        :param transaction_service: the transaction service
        :param account_service: the account service
        """
        self.__mapper = object_mapper
        self.__transaction_service = transaction_service
        self.__account_service = account_service

    def get_aggregation_by_period(self,
                                  account_ids: List[int] = None,
                                  year: int = None,
                                  month: int = None,
                                  label_ids: List[int] = None,
                                  sign: bool = None
                                  ) -> List[KeyValue]:
        """Gets the aggregation of all transaction for a given period.

        :param account_ids: the account ids
        :param year: the year
        :param month: the month
        :param label_ids: the label ids
        :param sign: the sign of all transaction
        :return: the list of (key, value) results
        """
        if year is None:
            year = int(datetime.datetime.now().strftime("%Y"))
        return self.__transaction_service.get_total_by_period(
            account_ids,
            year,
            month,
            PeriodType.MONTH,
            label_ids,
            sign
        )

    def get_evolution_for_year(self, account_ids: List[int] = None, year: int = None) -> List[KeyValue]:
        """Gets the evolution over a given year.

        :param account_ids: the account ids
        :param year: the year
        :return: the list of (key, value) results
        """
        if year is None:
            year = int(datetime.datetime.now().strftime("%Y"))
        date_from = datetime.date(year, 1, 1)
        start_amount = 0

        entries = self.__transaction_service.get_total_by_period(account_ids, year, None, PeriodType.MONTH)

        if account_ids is None:
            account_ids = []
            for acc in self.__account_service.get_all_accounts():
                account_ids.append(acc.id)
        acc_id: Optional[int]
        for acc_id in account_ids:
            account_total = self.__account_service.get_account_total(acc_id, date_from)
            if account_total is not None:
                start_amount = start_amount + account_total

        values = [KeyValue(str(year - 1) + '-12', start_amount)]
        for e in entries:
            if e.value is not None:
                start_amount = start_amount + e.value
            values.append(KeyValue(e.key, start_amount))
        return values

    def get_summary(self,
                    account_ids: List[int] = None,
                    year: int = None,
                    month: int = None,
                    label_ids: List[int] = None
                    ) -> Summary:
        """Gets the summary for the provided filters.

        :param account_ids: the accounts ids
        :param year: the year
        :param month: the month
        :param label_ids: the label ids
        :return: the summary
        """
        date_from = self.__transaction_service.get_date_from(year, month)
        date_to = self.__transaction_service.get_date_to(year, month)

        total_debit = self.__transaction_service.get_total(account_ids, year, month, False, label_ids)
        total_credit = self.__transaction_service.get_total(account_ids, year, month, True, label_ids)
        if account_ids is None:
            account_ids = []
            accounts = self.__account_service.get_all_accounts()
            for a in accounts:
                account_ids.append(a.id)
        amount_start = 0
        amount_end = 0
        acc_id: Optional[int]
        for acc_id in account_ids:
            amount_start = amount_start + self.__account_service.get_account_total(acc_id, date_from)
            amount_end = amount_end + self.__account_service.get_account_total(acc_id, date_to)

        period_type = PeriodType.YEAR if month is None else PeriodType.MONTH

        return Summary(
            amount_start,
            amount_end,
            total_credit,
            total_debit,
            period_type
        )
