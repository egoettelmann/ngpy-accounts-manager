from typing import List

from .label_service import LabelService
from ..models import Category
from ...dbconnector.entities import CategoryDbo
from ...dbconnector.repositories import CategoryRepository
from ...mapping import Mapper
from ...modules.depynject import injectable


@injectable()
class CategoryService:
    """
    The category service class that defines all business operations.
    """

    def __init__(self,
                 category_repository: CategoryRepository,
                 object_mapper: Mapper,
                 label_service: LabelService
                 ) -> None:
        """Constructor

        :param category_repository: the category repository
        :param object_mapper: the object mapper
        :param label_service: the label service
        """
        self.__repository = category_repository
        self.__mapper = object_mapper
        self.__label_service = label_service

    def get_all(self) -> List[Category]:
        """Gets all categories.

        :return: the list of categories
        """
        categories = self.__mapper.map_all(
            self.__repository.get_all(),
            Category
        )
        for cat in categories:
            cat_id: int = cat.id
            cat.num_labels = self.__label_service.count(cat_id)
        return categories

    def get_by_id(self, category_id: int) -> Category:
        """Gets a category by its id.

        :param category_id: the category id
        :return: the category
        """
        return self.__mapper.map(
            self.__repository.get_by_id(category_id),
            Category
        )

    def find_by_name(self, name: str) -> Category:
        """Finds a category by its name.

        :param name: the name
        :return: the category
        """
        category = self.__repository.find_by_name(name)
        return self.__mapper.map(category, Category)

    def delete_category(self, category_id: int) -> None:
        """Deletes a category by its id.

        :param category_id: the category id
        """
        self.__repository.delete_by_id(category_id)

    def save_category(self, category: Category) -> Category:
        """Saves a category (create and update).

        :param category: the category to save
        :return the saved category
        """
        saved_category = self.__repository.save_one(
            self.__mapper.map(category, CategoryDbo)
        )
        return self.__mapper.map(saved_category, Category)
