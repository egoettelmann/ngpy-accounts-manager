from flask import request

from ..domain.models import KeyValue, CompositeKeyValue, Summary
from ..modules import restipy
from ..modules.depynject import injectable


@injectable()
@restipy.prefix('/stats')
class StatisticsController():

    def __init__(self, statistics_service, account_service, transaction_service):
        self.statistics_service = statistics_service
        self.account_service = account_service
        self.transaction_service = transaction_service

    @restipy.route('/repartition')
    @restipy.format_as(KeyValue)
    def get_repartition(self):
        year = int(request.args.get('year'))
        month = int(request.args.get('month'))
        account_ids = request.args.get('account_ids')
        if account_ids is not None:
            account_ids = account_ids.split(',')
        return self.transaction_service.get_total_by_labels(account_ids, year, month)

    @restipy.route('/evolution')
    @restipy.format_as(KeyValue)
    def get_evolution(self):
        year = int(request.args.get('year'))
        account_ids = request.args.get('account_ids')
        if account_ids is not None:
            account_ids = account_ids.split(',')
        label_ids = request.args.get('label_ids')
        if label_ids is not None:
            label_ids = list(map(lambda a: None if a == '' else int(a), label_ids.split(',')))
        return self.statistics_service.get_evolution_for_year(account_ids, year, label_ids)

    @restipy.route('/summary')
    @restipy.format_as(Summary)
    def get_summary(self):
        year = int(request.args.get('year'))
        month = request.args.get('month')
        if month is not None:
            month = int(month)
        account_ids = request.args.get('account_ids')
        if account_ids is not None:
            account_ids = account_ids.split(',')
        label_ids = request.args.get('label_ids')
        if label_ids is not None:
            label_ids = list(map(lambda a: None if a == '' else int(a), label_ids.split(',')))
        return self.statistics_service.get_summary(account_ids, year, month, label_ids)

    @restipy.route('/analytics')
    @restipy.format_as(CompositeKeyValue)
    def get_analytics(self):
        quarterly = request.args.get('quarterly') == 'true'
        category_type = request.args.get('category_type')
        year = int(request.args.get('year'))
        account_ids = request.args.get('account_ids')
        if account_ids is not None:
            account_ids = account_ids.split(',')
        return self.transaction_service.get_total_by_category_type(account_ids, year, category_type, quarterly)

    @restipy.route('/analytics/details')
    @restipy.format_as(CompositeKeyValue)
    def get_analytics_details(self):
        category_type = request.args.get('category_type')
        year = int(request.args.get('year'))
        account_ids = request.args.get('account_ids')
        if account_ids is not None:
            account_ids = account_ids.split(',')
        return self.transaction_service.get_total_by_labels_and_category_type(account_ids, year, category_type)
