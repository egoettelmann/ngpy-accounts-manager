from typing import List, Optional

from ..search_request import FilterRequest, FilterOperator
from ...dbconnector.repositories import LabelRepository
from ...mapping import Mapper
from .transaction_service import TransactionService
from ..models import Label
from ...dbconnector.entities import LabelDbo
from ...modules.depynject import injectable


@injectable()
class LabelService:
    """
    The label service class that defines all business operations.
    """

    def __init__(self,
                 label_repository: LabelRepository,
                 object_mapper: Mapper,
                 transaction_service: TransactionService
                 ) -> None:
        """Constructor

        :param label_repository: the label repository
        :param object_mapper: the object mapper
        :param transaction_service: the transaction service
        """
        self.__repository = label_repository
        self.__mapper = object_mapper
        self.__transaction_service = transaction_service

    def get_all(self) -> List[Label]:
        """Gets a list of all labels.

        :return: the list of all labels
        """
        labels = self.__mapper.map_all(
            self.__repository.get_all(),
            Label
        )
        for label in labels:
            label_id: int = label.id
            filter_request = FilterRequest.of('label_id', label_id, FilterOperator.EQ)
            label.num_transactions = self.__transaction_service.count(filter_request)
        return labels

    def get_by_id(self, label_id: int) -> Label:
        """Gets a label by its id.

        :param label_id: the label id
        :return: the label
        """
        return self.__mapper.map(
            self.__repository.get_by_id(label_id),
            Label
        )

    def find_by_name(self, name: str) -> Optional[Label]:
        """Finds a label by its name.

        :param name: the name
        :return: the label
        """
        label = self.__repository.find_by_name(name)
        if not label:
            return None
        return self.__mapper.map(label, Label)

    def count(self, category_id: int = None) -> int:
        """Counts the number of labels for a given category id.

        :param category_id: the category id
        :return: the number of labels
        """
        return self.__repository.count(category_id)

    def delete_label(self, label_id: int) -> None:
        """Deletes a label by its id.

        :param label_id: the label id
        """
        self.__repository.delete_by_id(label_id)

    def save_label(self, label: Label) -> Label:
        """Saves a given label (create and update).

        :param label: the label to save
        :return: the saved label
        """
        saved_label = self.__repository.save_one(
            self.__mapper.map(label, LabelDbo)
        )
        return self.__mapper.map(saved_label, Label)
