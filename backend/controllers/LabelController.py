from flask_restful import Resource, marshal_with

from ..models.domain.Label import Label
from ..services.LabelService import LabelService


class Details(Resource):
    service = LabelService()

    @marshal_with(Label.resource_fields)
    def get(self, label_id=None):
        if label_id is None:
            return self.service.get_all()
        else:
            return self.service.get_by_id(label_id)
