from sqlalchemy.orm.query import Query

from ..entities import CategoryDbo
from ..manager import EntityManager


class CategoryRepository():
    query : Query
    entity_manager : EntityManager

    def __init__(self, entity_manager : EntityManager) -> None : ...

    def get_all(self) -> list(CategoryDbo) : ...

    def get_by_id(self, label_id : int) -> CategoryDbo : ...

    def find_by_name(self, name : str) -> CategoryDbo : ...

    def delete_by_id(self, category_id : int) -> None : ...

    def save_one(self, category : CategoryDbo) -> None : ...
