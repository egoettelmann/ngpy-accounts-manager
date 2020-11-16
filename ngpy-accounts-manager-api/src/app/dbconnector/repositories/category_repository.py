from typing import List

from ..entities import CategoryDbo
from ..manager import EntityManager
from ...modules.depynject import injectable


@injectable()
class CategoryRepository:
    """
    The category repository class that handles all database operations.
    """

    def __init__(self, entity_manager: EntityManager) -> None:
        """Constructor

        :param entity_manager: the entity manager
        """
        self.__entity_manager = entity_manager

    def get_all(self) -> List[CategoryDbo]:
        """Gets all categories

        :return: the list of all categories
        """
        return self.__entity_manager.query(CategoryDbo).all()

    def get_by_id(self, category_id: int) -> CategoryDbo:
        """Gets a category by its id.

        :param category_id: the category id
        :return: the category
        """
        return self.__entity_manager.query(CategoryDbo).get(category_id)

    def find_by_name(self, name: str) -> CategoryDbo:
        """Gets a category by its name.

        :param name: the name of the category
        :return: the category
        """
        return self.__entity_manager.query(CategoryDbo).filter(CategoryDbo.name == name).first()

    def delete_by_id(self, category_id: int) -> None:
        """Deletes a category by its id.

        :param category_id: the category id
        """
        self.__entity_manager.query(CategoryDbo).filter(CategoryDbo.id == category_id).delete()
        try:
            self.__entity_manager.get_session().commit()
        except:
            self.__entity_manager.get_session().rollback()
            raise

    def save_one(self, category: CategoryDbo) -> CategoryDbo:
        """Saves a category (create and update).

        :param category: the category to save
        :return: the saved category
        """
        del category.labels
        saved_category = self.__entity_manager.get_session().merge(category)
        try:
            self.__entity_manager.get_session().commit()
        except:
            self.__entity_manager.get_session().rollback()
            raise
        self.__entity_manager.get_session().refresh(saved_category)
        return saved_category
