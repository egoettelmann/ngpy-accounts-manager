from ...dbconnector.repositories.label import LabelRepository
from ...mapping import Mapper
from ..models import Label


class LabelService():
    repository : LabelRepository
    mapper : Mapper

    def __init__(self, label_repository : LabelRepository, object_mapper : Mapper) -> None : ...

    def get_all(self) -> list(Label) : ...

    def get_by_id(self, label_id : int) -> Label : ...

    def find_by_name(self, name : str) -> Label : ...
