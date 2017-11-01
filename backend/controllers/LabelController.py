from flask_restful import Resource

from .. import restful
from ..depynject import injectable


@injectable()
@restful.prefix('')
class LabelController(Resource):

    def __init__(self, label_service):
        self.label_service = label_service

    @restful.route('/labels')
    def get(self, label_id=None):
        if label_id is None:
            return self.label_service.get_all()
        else:
            return self.label_service.get_by_id(label_id)
