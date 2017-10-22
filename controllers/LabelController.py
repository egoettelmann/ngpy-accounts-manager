from flask_restful import Resource, marshal_with

from models.domain.Label import Label
from services.LabelService import LabelService


class LabelController(Resource):
    service = LabelService()

    @marshal_with(Label.resource_fields)
    def get(self):
        return self.service.get_all()