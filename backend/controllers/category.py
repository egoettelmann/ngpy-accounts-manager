from ..domain.models import Category
from ..modules import restipy
from ..modules.depynject import injectable


@injectable()
@restipy.prefix('/categories')
class CategoryController():

    def __init__(self, category_service):
        self.category_service = category_service

    @restipy.route('')
    @restipy.format_as(Category)
    def get_all(self):
        return self.category_service.get_all()

    @restipy.route('/<int:category_id>')
    @restipy.format_as(Category)
    def get_one(self, category_id):
        return self.category_service.get_by_id(category_id)

    @restipy.route('/<int:category_id>', methods=['DELETE'])
    def delete_one(self, category_id):
        return self.category_service.delete_category(category_id)

    @restipy.route('', methods=['POST'])
    @restipy.format_as(Category)
    @restipy.parse_as(Category)
    def save_one(self, category):
        return self.category_service.save_category(category)
