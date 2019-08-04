from typing import List, Optional

from ...mapping import Mapper
from ...dbconnector.repositories import UserRepository
from ..models import User
from ...modules.depynject import injectable


@injectable()
class UserService:
    """
    The user service class that defines all business operations.
    """

    def __init__(self, user_repository: UserRepository, object_mapper: Mapper):
        """Constructor

        :param user_repository: the user repository
        :param object_mapper: the object mapper
        """
        self.__repository = user_repository
        self.__mapper = object_mapper

    def get_all_users(self) -> List[User]:
        """Gets all users.

        :return: the list of all users
        """
        return self.__mapper.map_all(
            self.__repository.get_all(),
            User
        )

    def get_user(self, user_id: int) -> User:
        """Gets a user by its id.

        :param user_id: the user id
        :return: the user
        """
        return self.__mapper.map(
            self.__repository.get_by_id(user_id),
            User
        )

    def find_by_login(self, login: str) -> Optional[User]:
        """Finds a user by its login.

        :param login: the login
        :return: the user
        """
        user = self.__repository.find_by_login(login)
        if user is None:
            return None
        return self.__mapper.map(
            user,
            User
        )
