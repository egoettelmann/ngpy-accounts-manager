from flask import request
from flask_restful import Resource, marshal_with

from ..models.domain.Summary import Summary
from ..services.StatisticsService import StatisticsService


class SummaryController(Resource):
    service = StatisticsService()

    @marshal_with(Summary.resource_fields)
    def get(self):
        year = int(request.args.get('year'))
        month = int(request.args.get('month'))
        return self.service.get_summary(year, month)
