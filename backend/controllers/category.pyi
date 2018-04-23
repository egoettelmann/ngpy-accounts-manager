from ..domain.models import Category
from ..domain.services.category import CategoryService


class CategoryController():
    category_service : CategoryService

    def __init__(self, category_service : CategoryService) -> None : ...

    def get_all(self) -> list(Category) : ...

    def get_one(self, category_id : int) -> Category : ...
