from datetime import date, timedelta
from typing import List

from .account_service import AccountService
from .transaction_service import TransactionService
from ..models import KeyValue
from ..models import PeriodType
from ..models import Summary
from ..search_request import FilterRequest, FilterOperator
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

    def get_total_over_period(self,
                              period: PeriodType,
                              filter_request: FilterRequest
                              ) -> List[KeyValue]:
        """Gets the total of all transaction for a given period.

        :param period: the period
        :param filter_request: the filter request
        :return: the list of (key, value) results
        """
        return self.__transaction_service.get_total_over_period(period, filter_request)

    def get_evolution_over_period(self,
                                  period: PeriodType,
                                  account_ids: List[int],
                                  date_from: date,
                                  date_to: date,
                                  filter_request: FilterRequest
                                  ) -> List[KeyValue]:
        """Gets the evolution over a given year.

        :param period: the period
        :param account_ids: the account ids
        :param date_from: the from date
        :param date_to: the to date
        :param filter_request: the filter request
        :return: the list of (key, value) results
        """
        filters = FilterRequest.all(
            FilterRequest.of('date_value', date_from, FilterOperator.GE),
            FilterRequest.of('date_value', date_to, FilterOperator.LT),
            FilterRequest.of('account_id', account_ids, FilterOperator.IN),
            filter_request
        )

        # Retrieving all entries
        entries = self.__transaction_service.get_total_over_period(period, filters)

        # Calculating the start amount
        start_amount = 0
        for acc_id in account_ids:
            account_total = self.__account_service.get_account_total(acc_id, date_from)
            if account_total is not None:
                start_amount = start_amount + account_total

        # Calculating the start date
        key: str = ''
        if period == PeriodType.DAY:
            first_date = date_from - timedelta(days=1)
            key = first_date.strftime("%Y-%m-%d")
        if period == PeriodType.MONTH:
            first_date = date_from - timedelta(days=30)
            key = first_date.strftime("%Y-%m")
        if period == PeriodType.QUARTER:
            first_date = date_from - timedelta(days=90)
            key = first_date.strftime("%Y") + '-' + str((first_date.month + 2) / 3)
        if period == PeriodType.YEAR:
            first_date = date_from - timedelta(days=365)
            key = first_date.strftime("%Y")
        values = [KeyValue(key, start_amount)]

        # Re-calculating the evolution with the start amount
        for e in entries:
            if e.value is not None:
                start_amount = start_amount + e.value
            values.append(KeyValue(e.key, start_amount))
        return values

    def get_summary(self,
                    account_ids: List[int],
                    date_from: date,
                    date_to: date,
                    filter_request: FilterRequest
                    ) -> Summary:
        """Gets the summary for the provided filters.

        :param account_ids: the account ids
        :param date_from: the from date
        :param date_to: the to date
        :param filter_request: the filter request
        :return: the summary
        """
        filters = FilterRequest.all(
            FilterRequest.of('date_value', date_from, FilterOperator.GE),
            FilterRequest.of('date_value', date_to, FilterOperator.LT),
            FilterRequest.of('account_id', account_ids, FilterOperator.IN),
            filter_request
        )
        credit_filters = FilterRequest.all(
            FilterRequest.of('amount', 0, FilterOperator.GE),
            filters
        )
        debit_filters = FilterRequest.all(
            FilterRequest.of('amount', 0, FilterOperator.LT),
            filters
        )

        # Retrieving all entries
        total_debit = self.__transaction_service.get_total(debit_filters)
        total_credit = self.__transaction_service.get_total(credit_filters)

        # Calculating the start amounts
        amount_start = 0
        amount_end = 0
        for acc_id in account_ids:
            amount_start = amount_start + self.__account_service.get_account_total(acc_id, date_from)
            amount_end = amount_end + self.__account_service.get_account_total(acc_id, date_to)

        return Summary(
            amount_start,
            amount_end,
            total_credit,
            total_debit
        )
