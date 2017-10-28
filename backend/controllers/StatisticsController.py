from flask import request
from flask_restful import Resource, marshal_with

from ..models.domain.KeyValue import KeyValue
from ..services.StatisticsService import StatisticsService


class StatisticsController(Resource):
    service = StatisticsService()

    @marshal_with(KeyValue.resource_fields)
    def get(self):
        year = request.args.get('year')
        month = request.args.get('month')
        return self.service.get_grouped_by_labels(year, month)
