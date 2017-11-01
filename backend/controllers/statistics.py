from flask import request

from .. import restful
from ..depynject import injectable


@injectable()
@restful.prefix('/stats')
class StatisticsController():

    def __init__(self, statistics_service, account_service):
        self.statistics_service = statistics_service
        self.account_service = account_service

    @restful.route('/repartition')
    def get_repartition(self):
        year = request.args.get('year')
        month = request.args.get('month')
        return self.statistics_service.get_grouped_by_labels(year, month)

    @restful.route('/treasury')
    def get_treasury(self):
        year = int(request.args.get('year'))
        account_ids = request.args.get('account_ids')
        return self.account_service.get_evolution(year, account_ids)

    @restful.route('/summary')
    def get_summary(self):
        year = int(request.args.get('year'))
        month = request.args.get('month')
        if month is not None:
            month = int(month)
        return self.statistics_service.get_summary(year, month)
