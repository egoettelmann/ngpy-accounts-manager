from ..models import Label
from ...dbconnector.entities import LabelDbo
from ...modules.depynject import injectable


@injectable()
class LabelService():

    def __init__(self, label_repository, object_mapper, transaction_service):
        self.repository = label_repository
        self.mapper = object_mapper
        self.transaction_service = transaction_service

    def get_all(self):
        labels = self.mapper.map_all(
            self.repository.get_all(),
            Label
        )
        for label in labels:
            label.num_transactions = self.transaction_service.count(label.id)
        return labels

    def get_by_id(self, label_id):
        return self.mapper.map(
            self.repository.get_by_id(label_id),
            Label
        )

    def find_by_name(self, name):
        label = self.repository.find_by_name(name)
        if not label:
            return Label(name, "#428bca", "unchecked")
        return self.mapper.map(label, Label)

    def count(self, category_id=None):
        return self.repository.count(category_id)

    def delete_label(self, label_id):
        self.repository.delete_by_id(label_id)

    def save_label(self, label):
        self.repository.save_one(
            self.mapper.map(label, LabelDbo)
        )
