from ..models import Category
from ...dbconnector.repositories.category import CategoryRepository
from ...mapping import Mapper


class CategoryService():
    repository : CategoryRepository
    mapper : Mapper

    def __init__(self, category_repository : CategoryRepository, object_mapper : Mapper) -> None : ...

    def get_all(self) -> list(Category) : ...

    def get_by_id(self, label_id : int) -> Category : ...

    def find_by_name(self, name : str) -> Category : ...

    def delete_category(self, category_id : int) -> None : ...

    def save_category(self, category : Category) -> None : ...
