from ..models import User
from ...dbconnector.repositories.user import UserRepository
from ...mapping import Mapper


class UserService():
    repository : UserRepository
    mapper : Mapper

    def __init__(self,
                 user_repository : UserRepository,
                 object_mapper : Mapper) -> None : ...

    def get_all_users(self) -> list(User) : ...

    def get_user(self, user_id : int) -> User : ...

    def find_by_login(self, login : str) -> User : ...
