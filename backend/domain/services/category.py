from ..models import Category
from ...dbconnector.entities import CategoryDbo
from ...modules.depynject import injectable


@injectable()
class CategoryService():

    def __init__(self, category_repository, object_mapper, label_service):
        self.repository = category_repository
        self.mapper = object_mapper
        self.label_service = label_service

    def get_all(self):
        categories = self.mapper.map_all(
            self.repository.get_all(),
            Category
        )
        for cat in categories:
            cat.num_labels = self.label_service.count(cat.id)
        return categories

    def get_by_id(self, category_id):
        return self.mapper.map(
            self.repository.get_by_id(category_id),
            Category
        )

    def find_by_name(self, name):
        category = self.repository.find_by_name(name)
        return self.mapper.map(category, Category)

    def delete_category(self, category_id):
        self.repository.delete_by_id(category_id)

    def save_category(self, category):
        self.repository.save_one(
            self.mapper.map(category, CategoryDbo)
        )
