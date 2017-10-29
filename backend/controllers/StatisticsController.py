from flask import request
from flask_restful import Resource, marshal_with

from ..models.domain.Summary import Summary
from ..models.domain.KeyValue import KeyValue
from ..services.StatisticsService import StatisticsService
from ..services.AccountService import AccountService


class Repartition(Resource):
    service = StatisticsService()

    @marshal_with(KeyValue.resource_fields)
    def get(self):
        year = request.args.get('year')
        month = request.args.get('month')
        return self.service.get_grouped_by_labels(year, month)


class Treasury(Resource):
    service = AccountService()

    @marshal_with(KeyValue.resource_fields)
    def get(self):
        year = request.args.get('year')
        account_ids = request.args.get('account_ids')
        return self.service.get_evolution(year, account_ids)


class AccountSummary(Resource):
    service = StatisticsService()

    @marshal_with(Summary.resource_fields)
    def get(self):
        year = int(request.args.get('year'))
        month = int(request.args.get('month'))
        return self.service.get_summary(year, month)
