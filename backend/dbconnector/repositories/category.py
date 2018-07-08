from ..entities import CategoryDbo
from ...modules.depynject import injectable


@injectable()
class CategoryRepository():

    def __init__(self, entity_manager):
        self.entity_manager = entity_manager

    def get_all(self):
        return self.entity_manager.query(CategoryDbo).all()

    def get_by_id(self, category_id):
        return self.entity_manager.query(CategoryDbo).get(category_id)

    def find_by_name(self, name):
        return self.entity_manager.query(CategoryDbo).filter(CategoryDbo.name == name).first()

    def delete_by_id(self, category_id):
        self.entity_manager.query(CategoryDbo).filter(CategoryDbo.id == category_id).delete()
        try:
            self.entity_manager.get_session().commit()
        except:
            self.entity_manager.get_session().rollback()
            raise

    def save_one(self, category):
        self.entity_manager.get_session().merge(category)
        try:
            self.entity_manager.get_session().commit()
        except:
            self.entity_manager.get_session().rollback()
            raise
        return True
