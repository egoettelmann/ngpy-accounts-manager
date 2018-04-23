from flask_restful import marshal_with

from ..modules import restful
from ..modules.depynject import injectable
from ..domain.models import Category


@injectable()
@restful.prefix('/categories')
class CategoryController():

    def __init__(self, category_service):
        self.category_service = category_service

    @restful.route('')
    @marshal_with(Category.resource_fields)
    def get_all(self):
        return self.category_service.get_all()

    @restful.route('/<int:category_id>')
    @marshal_with(Category.resource_fields)
    def get_one(self, category_id):
        return self.category_service.get_by_id(category_id)
