from typing import List

from ..domain.services import CategoryService
from ..domain.models import Category
from ..modules import restipy
from ..modules.depynject import injectable


@injectable()
@restipy.prefix('/categories')
class CategoryController:
    """
    The category controller that handles all API requests
    """

    def __init__(self, category_service: CategoryService):
        """Constructor

        :param category_service: the category service
        """
        self.__category_service = category_service

    @restipy.route('')
    @restipy.format_as(Category)
    def get_all(self) -> List[Category]:
        """Gets all categories.

        :return: the list of all categories
        """
        return self.__category_service.get_all()

    @restipy.route('/<int:category_id>')
    @restipy.format_as(Category)
    def get_one(self, category_id: int) -> Category:
        """Gets a category by its id.

        :param category_id: the category id
        :return: the category
        """
        return self.__category_service.get_by_id(category_id)

    @restipy.route('/<int:category_id>', methods=['DELETE'])
    def delete_one(self, category_id: int) -> None:
        """Deletes a category by its id.

        :param category_id: the category id
        """
        self.__category_service.delete_category(category_id)

    @restipy.route('', methods=['POST'])
    @restipy.format_as(Category)
    @restipy.parse_as(Category)
    def save_one(self, category: Category) -> Category:
        """Saves a category (create and update).

        :param category: the category to save
        :return: the saved category
        """
        return self.__category_service.save_category(category)
