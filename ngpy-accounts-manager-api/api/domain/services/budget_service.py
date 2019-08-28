from datetime import date
from typing import List

from .transaction_service import TransactionService
from ..models import Budget, BudgetStatus, PeriodType
from ..search_request import FilterRequest, FilterOperator
from ...dbconnector.entities import BudgetDbo
from ...dbconnector.repositories import BudgetRepository
from ...mapping import Mapper
from ...modules.depynject import injectable


@injectable()
class BudgetService:
    """
    The budget service class that defines all business operations.
    """

    def __init__(self,
                 budget_repository: BudgetRepository,
                 object_mapper: Mapper,
                 transaction_service: TransactionService
                 ) -> None:
        """Constructor

        :param budget_repository: the budget repository
        :param object_mapper: the object mapper
        :param transaction_service: the transaction service
        """
        self.__repository = budget_repository
        self.__mapper = object_mapper
        self.__transaction_service = transaction_service

    def find_all(self, filter_request: FilterRequest) -> List[Budget]:
        """Gets a list of all budgets matching the provided filters.

        :param filter_request: the filter request
        :return: the list of all budgets
        """
        return self.__mapper.map_all(
            self.__repository.find_all(filter_request),
            Budget
        )

    def get_by_id(self, budget_id: int) -> Budget:
        """Gets a budget by its id.

        :param budget_id: the budget id
        :return: the budget
        """
        return self.__mapper.map(
            self.__repository.get_by_id(budget_id),
            Budget
        )

    def delete_budget(self, budget_id: int) -> None:
        """Deletes a budget by its id.

        :param budget_id: the budget id
        """
        self.__repository.delete_by_id(budget_id)

    def save_budget(self, budget: Budget) -> Budget:
        """Saves a given budget (create and update).

        :param budget: the budget to save
        :return: the saved budget
        """
        saved_budget = self.__repository.save_one(
            self.__mapper.map(budget, BudgetDbo)
        )
        return self.__mapper.map(saved_budget, Budget)

    def get_status_list(self,
                        status_date: date,
                        filter_request: FilterRequest
                        ) -> List[BudgetStatus]:
        """Gets a list of all budget status matching the provided filters.

        :param status_date: the end date
        :param filter_request: the filter request
        :return: the list of all budgets status
        """
        budgets = self.__repository.find_all(filter_request)
        status_list = []
        for budget in budgets:
            # Adding the label filters
            label_ids = list(
                map(lambda l: l.id, budget.labels)
            )
            transaction_filters = FilterRequest.all(
                FilterRequest.of('label_id', label_ids, FilterOperator.IN)
            )

            # Adding the account filters
            if budget.accounts is not None and len(budget.accounts) > 0:
                account_ids = list(
                    map(lambda a: a.id, budget.accounts)
                )
                transaction_filters = FilterRequest.all(
                    FilterRequest.of('account_id', account_ids, FilterOperator.IN),
                    transaction_filters
                )

            # Get the total spending on the period
            period_type = PeriodType.resolve(budget.period)
            if period_type == PeriodType.DAY:
                total = self.__get_daily_total(status_date, transaction_filters)
            elif period_type == PeriodType.MONTH:
                total = self.__get_monthly_total(status_date, transaction_filters)
            elif period_type == PeriodType.QUARTER:
                total = self.__get_quarterly_total(status_date, transaction_filters)
            else:
                total = self.__get_yearly_total(status_date, transaction_filters)

            # Create the status object and append to list
            status = BudgetStatus(budget, total)
            status_list.append(status)

        return status_list

    def __get_daily_total(self, status_date: date, transaction_filters: FilterRequest) -> float:
        """Gets the daily total for a given date matching the provided filters

        :param status_date: the date
        :param transaction_filters: the filters
        :return: the total
        """
        date_from = date(status_date.year, status_date.month, status_date.day)
        date_to = date(status_date.year, status_date.month, status_date.day + 1)
        filters = FilterRequest.all(
            FilterRequest.of('date_value', date_from, FilterOperator.GE),
            FilterRequest.of('date_value', date_to, FilterOperator.LT),
            transaction_filters
        )
        return self.__transaction_service.get_total(filters)

    def __get_monthly_total(self, status_date: date, transaction_filters: FilterRequest) -> float:
        """Gets the monthly total for a given date matching the provided filters

        :param status_date: the date
        :param transaction_filters: the filters
        :return: the total
        """
        date_from = date(status_date.year, status_date.month, 1)
        date_to = date(status_date.year, status_date.month + 1, 1)
        filters = FilterRequest.all(
            FilterRequest.of('date_value', date_from, FilterOperator.GE),
            FilterRequest.of('date_value', date_to, FilterOperator.LT),
            transaction_filters,
        )
        return self.__transaction_service.get_total(filters)

    def __get_quarterly_total(self, status_date: date, transaction_filters: FilterRequest) -> float:
        """Gets the quarterly total for a given date matching the provided filters

        :param status_date: the date
        :param transaction_filters: the filters
        :return: the total
        """
        quarter = int((status_date.month - 1) / 3) + 1
        start_month = (quarter - 1) * 3
        date_from = date(status_date.year, start_month, 1)
        if quarter == 4:
            date_to = date(status_date.year, quarter * 3, 1)
        else:
            date_to = date(status_date.year + 1, 1, 1)
        filters = FilterRequest.all(
            FilterRequest.of('date_value', date_from, FilterOperator.GE),
            FilterRequest.of('date_value', date_to, FilterOperator.LT),
            transaction_filters,
        )
        return self.__transaction_service.get_total(filters)

    def __get_yearly_total(self, status_date: date, transaction_filters: FilterRequest) -> float:
        """Gets the yearly total for a given date matching the provided filters

        :param status_date: the date
        :param transaction_filters: the filters
        :return: the total
        """
        date_from = date(status_date.year, 1, 1)
        date_to = date(status_date.year + 1, 1, 1)
        filters = FilterRequest.all(
            FilterRequest.of('date_value', date_from, FilterOperator.GE),
            FilterRequest.of('date_value', date_to, FilterOperator.LT),
            transaction_filters,
        )
        return self.__transaction_service.get_total(filters)
