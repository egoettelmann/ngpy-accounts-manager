from ...modules.depynject import injectable
from ..models import Category


@injectable()
class CategoryService():

    def __init__(self, category_repository, object_mapper):
        self.repository = category_repository
        self.mapper = object_mapper

    def get_all(self):
        return self.mapper.map_all(
            self.repository.get_all(),
            Category
        )

    def get_by_id(self, label_id):
        return self.mapper.map(
            self.repository.get_by_id(label_id),
            Category
        )

    def find_by_name(self, name):
        category = self.repository.find_by_name(name)
        return self.mapper.map(category, Category)
