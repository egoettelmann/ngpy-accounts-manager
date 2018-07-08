from ...modules.depynject import injectable
from ..models import Label


@injectable()
class LabelService():

    def __init__(self, label_repository, object_mapper):
        self.repository = label_repository
        self.mapper = object_mapper

    def get_all(self):
        return self.mapper.map_all(
            self.repository.get_all(),
            Label
        )

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

    def delete_label(self, label_id):
        self.repository.delete_by_id(label_id)
