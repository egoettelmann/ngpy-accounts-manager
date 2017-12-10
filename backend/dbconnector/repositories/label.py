from ..entities import LabelDbo
from ...modules.depynject import injectable


@injectable()
class LabelRepository():

    def __init__(self, entity_manager):
        self.entity_manager = entity_manager

    def get_all(self):
        return self.entity_manager.query(LabelDbo).all()

    def get_by_id(self, label_id):
        return self.entity_manager.query(LabelDbo).get(label_id)

    def find_by_name(self, name):
        return self.entity_manager.query(LabelDbo).filter(LabelDbo.name == name).first()