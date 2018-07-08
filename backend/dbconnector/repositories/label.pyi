from sqlalchemy.orm.query import Query

from ..entities import LabelDbo
from ..manager import EntityManager


class LabelRepository():
    query : Query
    entity_manager : EntityManager

    def __init__(self, entity_manager : EntityManager) -> None : ...

    def get_all(self) -> list(LabelDbo) : ...

    def get_by_id(self, label_id : int) -> LabelDbo : ...

    def find_by_name(self, name : str) -> LabelDbo : ...

    def delete_by_id(self, label_id : int) -> None : ...

    def save_one(self, label : LabelDbo) -> None : ...
