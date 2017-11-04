from ..dbconnector.entities import LabelDbo
from ..depynject import injectable
from ..models.domain.Label import Label


@injectable()
class LabelService():

    def __init__(self, object_mapper):
        self.mapper = object_mapper

    def get_all(self):
        labels = LabelDbo.query.all()
        return self.mapper.map_all(labels, Label)

    def get_by_id(self, label_id):
        label = LabelDbo.query.get(label_id)
        return self.mapper.map(label, Label)

    def find_by_name(self, name):
        label = LabelDbo.query.filter(LabelDbo.name == name).first()
        if not label:
            label = LabelDbo(name, "#428bca")
            label.icon = "unchecked"
        return self.mapper.map(label, Label)
