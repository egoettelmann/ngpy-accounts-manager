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

    def count(self, category_id=None):
        query = self.entity_manager.query(LabelDbo)
        if category_id is not None:
            query = query.filter(LabelDbo.category_id == category_id)
        return query.count()

    def delete_by_id(self, label_id):
        self.entity_manager.query(LabelDbo).filter(LabelDbo.id == label_id).delete()
        try:
            self.entity_manager.get_session().commit()
        except:
            self.entity_manager.get_session().rollback()
            raise

    def save_one(self, label):
        self.entity_manager.get_session().merge(label)
        try:
            self.entity_manager.get_session().commit()
        except:
            self.entity_manager.get_session().rollback()
            raise
        return True
