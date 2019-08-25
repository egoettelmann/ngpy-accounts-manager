import logging
from typing import List

from ..query_builder import QueryBuilder
from ...domain.search_request import FilterRequest
from ..entities import BudgetDbo
from ..manager import EntityManager
from ...modules.depynject import injectable


@injectable()
class BudgetRepository:
    """
    The budget repository class that handles all database operations.
    """

    def __init__(self, entity_manager: EntityManager) -> None:
        """Constructor

        :param entity_manager: the entity manager
        """
        self.__entity_manager = entity_manager
        self.__query_builder = QueryBuilder(BudgetDbo)

    def find_all(self, filter_request: FilterRequest) -> List[BudgetDbo]:
        """Gets all budgets matching the provided filters.

        :param filter_request: the filter request
        :return: the list of all budgets
        """
        query = self.__entity_manager.query(BudgetDbo)
        query = self.__query_builder.build(
            query,
            filters=filter_request
        )
        logging.debug(query)
        return query.all()

    def get_by_id(self, budget_id: int) -> BudgetDbo:
        """Gets a budget by its id.

        :param budget_id: the budget id
        :return: the budget
        """
        return self.__entity_manager.query(BudgetDbo).get(budget_id)

    def delete_by_id(self, budget_id: int) -> None:
        """Deletes a budget by its id.

        :param budget_id: the budget id
        """
        self.__entity_manager.query(BudgetDbo).filter(BudgetDbo.id == budget_id).delete()
        try:
            self.__entity_manager.get_session().commit()
        except:
            self.__entity_manager.get_session().rollback()
            raise

    def save_one(self, budget: BudgetDbo) -> BudgetDbo:
        """Saves a budget (create and update).

        :param budget: the budget to save
        :return: the saved budget
        """
        saved_budget = self.__entity_manager.get_session().merge(budget)
        try:
            self.__entity_manager.get_session().commit()
        except:
            self.__entity_manager.get_session().rollback()
            raise
        self.__entity_manager.get_session().refresh(saved_budget)
        return saved_budget
