from ..domain.models import Label
from ..domain.services.label import LabelService


class LabelController():
    label_service : LabelService

    def __init__(self, label_service : LabelService) -> None : ...

    def get_all(self) -> list(Label) : ...

    def get_one(self, label_id : int) -> Label : ...

    def delete_one(self, label_id : int) -> None : ...
