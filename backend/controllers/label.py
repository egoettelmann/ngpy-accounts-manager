from flask_restful import marshal_with

from ..modules import restful
from ..modules.depynject import injectable
from ..domain.models import Label


@injectable()
@restful.prefix('/labels')
class LabelController():

    def __init__(self, label_service):
        self.label_service = label_service

    @restful.route('')
    @marshal_with(Label.resource_fields)
    def get_all(self):
        return self.label_service.get_all()

    @restful.route('/<int:label_id>')
    @marshal_with(Label.resource_fields)
    def get_one(self, label_id):
        return self.label_service.get_by_id(label_id)
