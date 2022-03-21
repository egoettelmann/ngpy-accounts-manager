from typing import List
from datetime import date, datetime

from flask import request

from ..domain.models import Budget, BudgetStatus
from ..domain.services import BudgetService
from ..modules import restipy
from ..modules.depynject import injectable
from ..rql_parser import RqlRequestParser


@injectable()
@restipy.prefix('/budgets')
class BudgetController:
    """
    The budget controller that handles all API requests
    """

    def __init__(self,budget_service: BudgetService) -> None:
        """Constructor

        :param budget_service: the budget service
        """
        self.__budget_service = budget_service
        self.__rql_parser = RqlRequestParser({
            'accountId': 'accounts.id',
            'labelId': 'labels.id',
            'period': 'period',
            'categoryType': 'labels.category.type'
        })

    @restipy.route('')
    @restipy.format_as(Budget)
    def find_all(self) -> List[Budget]:
        """Gets all budgets matching the provided filters.

        :return: the list of budgets
        """
        filter_request = self.__rql_parser.parse_filters(request)
        return self.__budget_service.find_all(filter_request)

    @restipy.route('/<int:budget_id>')
    @restipy.format_as(Budget)
    def get_one(self, budget_id: int) -> Budget:
        """Gets a budget by its id.

        :param budget_id: the budget id
        :return: the budget
        """
        return self.__budget_service.get_by_id(budget_id)

    @restipy.route('/<int:budget_id>', methods=['DELETE'])
    def delete_one(self, budget_id: int) -> None:
        """Deletes a budget by its id.

        :param budget_id: the budget id
        """
        self.__budget_service.delete_budget(budget_id)

    @restipy.route('', methods=['PUT'])
    @restipy.format_as(Budget)
    @restipy.parse_as(Budget)
    def save_one(self, budget: Budget) -> Budget:
        """Saves a budget.

        :param budget: the budget to save
        :return: the saved budget
        """
        return self.__budget_service.save_budget(budget)

    @restipy.route('/status')
    @restipy.format_as(BudgetStatus)
    def get_status_list(self) -> List[BudgetStatus]:
        """Gets the status list of all budgets.

        :return: the list of budget status
        """
        # From date
        status_date = request.args.get('date')
        if status_date is not None:
            status_date = datetime.strptime(status_date, '%Y-%m-%d').date()
        else:
            status_date = date.today()

        # Filter request
        filter_request = self.__rql_parser.parse_filters(request)
        return self.__budget_service.get_status_list(status_date, filter_request)
