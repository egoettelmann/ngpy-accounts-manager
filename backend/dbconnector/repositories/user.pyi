from sqlalchemy.orm.query import Query

from ..entities import UserDbo
from ..manager import EntityManager


class UserRepository():
    query : Query
    entity_manager : EntityManager

    def __init__(self, entity_manager : EntityManager) -> None : ...

    def get_all(self) -> list(UserDbo) : ...

    def get_by_id(self, user_id : int) -> UserDbo : ...

    def find_by_login(self, login : str) -> UserDbo : ...
