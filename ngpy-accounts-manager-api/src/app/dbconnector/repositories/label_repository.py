from typing import List

from ..entities import LabelDbo
from ..manager import EntityManager
from ...modules.depynject import injectable


@injectable()
class LabelRepository:
    """
    The label repository class that handles all database operations.
    """

    def __init__(self, entity_manager: EntityManager) -> None:
        """Constructor

        :param entity_manager: the entity manager
        """
        self.__entity_manager = entity_manager

    def get_all(self) -> List[LabelDbo]:
        """Gets all labels

        :return: the list of all labels
        """
        return self.__entity_manager.query(LabelDbo).order_by(LabelDbo.name).all()

    def get_by_id(self, label_id: int) -> LabelDbo:
        """Gets a label by its id.

        :param label_id: the label id
        :return: the label
        """
        return self.__entity_manager.query(LabelDbo).get(label_id)

    def find_by_name(self, name: str) -> LabelDbo:
        """Finds a label by its name.

        :param name: the name
        :return: the label
        """
        return self.__entity_manager.query(LabelDbo).filter(LabelDbo.name == name).first()

    def count(self, category_id: int = None) -> int:
        """Counts the number of labels for a given category.

        :param category_id: the category id
        :return: the number of labels
        """
        query = self.__entity_manager.query(LabelDbo)
        if category_id is not None:
            query = query.filter(LabelDbo.category_id == category_id)
        return query.count()

    def delete_by_id(self, label_id: int) -> None:
        """Deletes a label by its id.

        :param label_id: the label id
        """
        self.__entity_manager.query(LabelDbo).filter(LabelDbo.id == label_id).delete()
        try:
            self.__entity_manager.get_session().commit()
        except:
            self.__entity_manager.get_session().rollback()
            raise

    def save_one(self, label: LabelDbo) -> LabelDbo:
        """Saves a label (create and update).

        :param label: the label to save
        :return: the saved label
        """
        del label.transactions
        del label.category
        saved_label = self.__entity_manager.get_session().merge(label)
        try:
            self.__entity_manager.get_session().commit()
        except:
            self.__entity_manager.get_session().rollback()
            raise
        self.__entity_manager.get_session().refresh(saved_label)
        return saved_label
