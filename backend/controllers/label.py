from flask_restful import marshal_with

from .. import restful
from ..depynject import injectable
from ..models.domain.Label import Label


@injectable()
@restful.prefix('')
class LabelController():

    def __init__(self, label_service):
        self.label_service = label_service

    @restful.route('/labels')
    @marshal_with(Label.resource_fields)
    def get(self, label_id=None):
        if label_id is None:
            return self.label_service.get_all()
        else:
            return self.label_service.get_by_id(label_id)
