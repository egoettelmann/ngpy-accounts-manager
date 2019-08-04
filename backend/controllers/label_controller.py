from typing import List

from ..domain.models import Label
from ..domain.services import LabelService
from ..modules import restipy
from ..modules.depynject import injectable


@injectable()
@restipy.prefix('/labels')
class LabelController:
    """
    The label controller that handles all API requests.
    """

    def __init__(self, label_service: LabelService):
        self.__label_service = label_service

    @restipy.route('')
    @restipy.format_as(Label)
    def get_all(self) -> List[Label]:
        """Gets all labels

        :return: the list of all labels
        """
        return self.__label_service.get_all()

    @restipy.route('/<int:label_id>')
    @restipy.format_as(Label)
    def get_one(self, label_id: int) -> Label:
        """Gets a label by its id

        :param label_id: the label id
        :return: the label
        """
        return self.__label_service.get_by_id(label_id)

    @restipy.route('/<int:label_id>', methods=['DELETE'])
    def delete_one(self, label_id: int) -> None:
        """Deletes a label by its id.

        :param label_id: the label id
        """
        self.__label_service.delete_label(label_id)

    @restipy.route('', methods=['POST'])
    @restipy.format_as(Label)
    @restipy.parse_as(Label)
    def save_one(self, label: Label) -> Label:
        """Saves a label (create and update)

        :param label: the label to save
        :return: the saved label
        """
        return self.__label_service.save_label(label)
