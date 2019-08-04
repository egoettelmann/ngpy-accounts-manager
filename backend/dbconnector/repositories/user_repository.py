from typing import List

from ..manager import EntityManager
from ..entities import UserDbo
from ...modules.depynject import injectable


@injectable()
class UserRepository:
    """
    The user repository class that handles all database operations.
    """

    def __init__(self, entity_manager: EntityManager) -> None:
        """Constructor

        :param entity_manager: the entity manager
        """
        self.entity_manager = entity_manager

    def get_all(self) -> List[UserDbo]:
        """Gets the list of all users.

        :return: the list of all users
        """
        return self.entity_manager.query(UserDbo).all()

    def get_by_id(self, user_id: int) -> UserDbo:
        """Gets a user by its id

        :param user_id: the user id
        :return: the user
        """
        return self.entity_manager.query(UserDbo).get(user_id)

    def find_by_login(self, login: str) -> UserDbo:
        """Finds a user by its login.

        :param login: the login
        :return: the user
        """
        return self.entity_manager.query(UserDbo).filter(UserDbo.login == login).first()
