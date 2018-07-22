from .transaction import TransactionService
from ..models import Label
from ...dbconnector.repositories.label import LabelRepository
from ...mapping import Mapper


class LabelService():
    repository: LabelRepository
    mapper: Mapper
    transaction_service: TransactionService

    def __init__(self,
                 label_repository: LabelRepository,
                 object_mapper: Mapper,
                 transaction_service: TransactionService
                 ) -> None: ...

    def get_all(self) -> list(Label): ...

    def get_by_id(self, label_id: int) -> Label: ...

    def find_by_name(self, name: str) -> Label: ...

    def count(self, category_id: int) -> int: ...

    def delete_label(self, label_id: int) -> None: ...

    def save_label(self, label: Label) -> Label: ...
