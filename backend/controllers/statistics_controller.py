from typing import List

from flask import request

from ..domain.models import KeyValue, CompositeKeyValue, Summary
from ..domain.services import StatisticsService, AccountService, TransactionService
from ..modules import restipy
from ..modules.depynject import injectable


@injectable()
@restipy.prefix('/stats')
class StatisticsController:
    """
    The statistics controller that handles all API requests
    """

    def __init__(self,
                 statistics_service: StatisticsService,
                 account_service: AccountService,
                 transaction_service: TransactionService
                 ) -> None:
        """Constructor

        :param statistics_service: the statistics service
        :param account_service: the account service
        :param transaction_service: the transaction service
        """
        self.__statistics_service = statistics_service
        self.__account_service = account_service
        self.__transaction_service = transaction_service

    @restipy.route('/repartition')
    @restipy.format_as(KeyValue)
    def get_repartition(self) -> List[KeyValue]:
        """Gets the repartition by labels

        :return: the list of (key, value) results
        """
        year = int(request.args.get('year'))
        month = int(request.args.get('month'))
        account_ids = request.args.get('account_ids')
        if account_ids is not None:
            account_ids = account_ids.split(',')
        return self.__transaction_service.get_total_by_labels(account_ids, year, month)

    @restipy.route('/evolution')
    @restipy.format_as(KeyValue)
    def get_evolution(self) -> List[KeyValue]:
        """Gets the evolution for a year

        :return: the list of (key, value) results
        """
        year = int(request.args.get('year'))
        account_ids = request.args.get('account_ids')
        if account_ids is not None:
            account_ids = account_ids.split(',')
        return self.__statistics_service.get_evolution_for_year(account_ids, year)

    @restipy.route('/aggregation')
    @restipy.format_as(KeyValue)
    def get_aggregation(self) -> List[KeyValue]:
        """Gets the aggregation by period

        :return: the list of (key, value) results
        """
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
        sign = request.args.get('credit')
        if sign is not None:
            sign = sign == 'true'
        return self.__statistics_service.get_aggregation_by_period(account_ids, year, month, label_ids, sign)

    @restipy.route('/summary')
    @restipy.format_as(Summary)
    def get_summary(self) -> Summary:
        """Gets the summary for the provided filters.

        :return: the summary
        """
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
        return self.__statistics_service.get_summary(account_ids, year, month, label_ids)

    @restipy.route('/analytics')
    @restipy.format_as(CompositeKeyValue)
    def get_analytics(self) -> List[CompositeKeyValue]:
        """Gets the analytics for the provided filters.

        :return: the list of (key_one, key_two, value) results
        """
        quarterly = request.args.get('quarterly') == 'true'
        category_type = request.args.get('category_type')
        year = int(request.args.get('year'))
        account_ids = request.args.get('account_ids')
        if account_ids is not None:
            account_ids = account_ids.split(',')
        return self.__transaction_service.get_total_by_category_type(account_ids, year, category_type, quarterly)

    @restipy.route('/analytics/details')
    @restipy.format_as(CompositeKeyValue)
    def get_analytics_details(self) -> List[CompositeKeyValue]:
        """Gets the analytics details for the provided filters.

        :return: the list of (key_one, key_two, value) results
        """
        category_type = request.args.get('category_type')
        year = int(request.args.get('year'))
        account_ids = request.args.get('account_ids')
        if account_ids is not None:
            account_ids = account_ids.split(',')
        return self.__transaction_service.get_total_by_labels_and_category_type(account_ids, year, category_type)
