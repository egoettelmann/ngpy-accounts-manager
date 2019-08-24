from typing import List

from .. import EntityManager, QueryBuilder
from ..entities import AccountDbo
from ...domain.search_request import SearchRequest
from ...modules.depynject import injectable


@injectable()
class AccountRepository:
    """
    The account repository class that handles all database operations.
    """

    def __init__(self,
                 entity_manager: EntityManager
                 ) -> None:
        """Constructor

        :param entity_manager: the entity manager
        """
        self.__entity_manager = entity_manager
        self.__query_builder = QueryBuilder(AccountDbo)

    def get_all(self) -> List[AccountDbo]:
        """Gets the list of all accounts.

        :return: the list of all accounts
        """
        return self.__entity_manager.query(AccountDbo).all()

    def find_all(self, search_request: SearchRequest) -> List[AccountDbo]:
        """Gets all accounts matching the provided filters.

        :param search_request: the search request
        :return: the list of accounts
        """
        query = self.__entity_manager.query(AccountDbo)
        query = self.__query_builder.build(
            query,
            filters=search_request.filter_request,
            sort=search_request.sort_request,
            paginate=search_request.page_request
        )
        return query.all()

    def get_by_id(self, account_id: int) -> AccountDbo:
        """Gets an account by its id.

        :param account_id: the account id
        :return: the account
        """
        return self.__entity_manager.query(AccountDbo).get(account_id)

    def find_by_name(self, name: str) -> AccountDbo:
        """Finds an account by its name.

        :param name: the name of the account
        :return: the account
        """
        return self.__entity_manager.query(AccountDbo).filter(AccountDbo.name == name).first()

    def delete_by_id(self, account_id: int) -> None:
        """Deletes an account by its id.

        :param account_id: the account id
        """
        self.__entity_manager.query(AccountDbo).filter(AccountDbo.id == account_id).delete()
        try:
            self.__entity_manager.get_session().commit()
        except:
            self.__entity_manager.get_session().rollback()
            raise

    def save_one(self, account: AccountDbo) -> AccountDbo:
        """Saves an account (create and update).

        :param account: the account to save
        :return: the saved account
        """
        saved_account = self.__entity_manager.get_session().merge(account)
        try:
            self.__entity_manager.get_session().commit()
        except:
            self.__entity_manager.get_session().rollback()
            raise
        self.__entity_manager.get_session().refresh(saved_account)
        return saved_account
