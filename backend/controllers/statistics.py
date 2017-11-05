from flask import request
from flask_restful import marshal_with

from ..modules import restful
from ..modules.depynject import injectable
from ..domain.models import KeyValue
from ..domain.models import Summary


@injectable()
@restful.prefix('/stats')
class StatisticsController():

    def __init__(self, statistics_service, account_service, transaction_service):
        self.statistics_service = statistics_service
        self.account_service = account_service
        self.transaction_service = transaction_service

    @restful.route('/repartition')
    @marshal_with(KeyValue.resource_fields)
    def get_repartition(self):
        year = int(request.args.get('year'))
        month = int(request.args.get('month'))
        return self.transaction_service.get_total_by_labels(None, year, month)

    @restful.route('/treasury')
    @marshal_with(KeyValue.resource_fields)
    def get_treasury(self):
        year = int(request.args.get('year'))
        account_ids = request.args.get('account_ids')
        return self.account_service.get_evolution_for_year(account_ids, year)

    @restful.route('/summary')
    @marshal_with(Summary.resource_fields)
    def get_summary(self):
        year = int(request.args.get('year'))
        month = request.args.get('month')
        if month is not None:
            month = int(month)
        return self.statistics_service.get_summary(None, year, month)
