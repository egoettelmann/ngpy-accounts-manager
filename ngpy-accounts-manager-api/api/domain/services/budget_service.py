from typing import List

from .transaction_service import TransactionService
from ..models import Budget
from ..search_request import FilterRequest
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
