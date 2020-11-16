import logging
from typing import List

from ..query_builder import QueryBuilder
from ...domain.search_request import FilterRequest
from ..entities import BudgetDbo
from ..manager import EntityManager
from ...modules.depynject import injectable
from .account_repository import AccountRepository
from .label_repository import LabelRepository


@injectable()
class BudgetRepository:
    """
    The budget repository class that handles all database operations.
    """

    def __init__(self,
                 entity_manager: EntityManager,
                 account_repository: AccountRepository,
                 label_repository: LabelRepository
                 ) -> None:
        """Constructor

        :param entity_manager: the entity manager
        :param account_repository: the account repository
        :param label_repository: the label repository
        """
        self.__entity_manager = entity_manager
        self.__account_repository = account_repository
        self.__label_repository = label_repository
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
        existing_labels = []
        existing_accounts = []
        if budget.id is not None:
            existing_budget = self.get_by_id(budget.id)
            existing_labels = existing_budget.labels
            existing_accounts = existing_budget.accounts
        new_labels = []
        for label in budget.labels:
            findings = list(filter(lambda x: x.id == label.id, existing_labels))
            if len(findings) > 0:
                new_labels.append(findings[0])
            else:
                new_labels.append(self.__label_repository.get_by_id(label.id))
        budget.labels = new_labels
        new_accounts = []
        for account in budget.accounts:
            findings = list(filter(lambda x: x.id == account.id, existing_accounts))
            if len(findings) > 0:
                new_accounts.append(findings[0])
            else:
                new_accounts.append(self.__account_repository.get_by_id(account.id))
        budget.accounts = new_accounts
        saved_budget = self.__entity_manager.get_session().merge(budget)
        try:
            self.__entity_manager.get_session().commit()
        except:
            self.__entity_manager.get_session().rollback()
            raise
        self.__entity_manager.get_session().refresh(saved_budget)
        return saved_budget
