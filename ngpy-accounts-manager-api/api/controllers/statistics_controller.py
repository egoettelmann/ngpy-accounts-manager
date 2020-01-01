from datetime import datetime, date
from typing import List

from flask import request

from ..domain.models import KeyValue, CompositeKeyValue, Summary, PeriodType
from ..domain.services import StatisticsService, AccountService, TransactionService
from ..modules import restipy
from ..modules.depynject import injectable
from ..rql_parser import RqlRequestParser


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
        self.__rql_parser = RqlRequestParser({
            'accountId': 'account_id',
            'labelId': 'label_id',
            'reference': 'reference',
            'description': 'description',
            'amount': 'amount',
            'dateValue': 'date_value',
            'categoryId': 'label.category.id',
            'categoryType': 'label.category.type'
        })

    @restipy.route('/repartition')
    @restipy.format_as(KeyValue)
    def get_repartition(self) -> List[KeyValue]:
        """Gets the repartition by labels

        :return: the list of (key, value) results
        """
        filter_request = self.__rql_parser.parse_filters(request)
        return self.__transaction_service.get_total_by_labels(filter_request)

    @restipy.route('/evolution')
    @restipy.format_as(KeyValue)
    def get_evolution(self) -> List[KeyValue]:
        """Gets the evolution for a year

        :return: the list of (key, value) results
        """
        # Period
        period = request.args.get('period')
        if period is not None:
            period = PeriodType.resolve(period)
        if period is None:
            period = PeriodType.MONTH

        # Account ids
        account_ids = request.args.get('account_ids')
        if account_ids is not None:
            account_ids = account_ids.split(',')
        else:
            account_ids = list(map(lambda x: x.id, self.__account_service.get_all_accounts()))

        # From date
        date_from = request.args.get('date_from')
        if date_from is not None:
            date_from = datetime.strptime(date_from, '%Y-%m-%d').date()
        else:
            date_from = date.today()

        # To date
        date_to = request.args.get('date_to')
        if date_to is not None:
            date_to = datetime.strptime(date_to, '%Y-%m-%d').date()
        else:
            date_to = date.today()

        # Filter request
        filter_request = self.__rql_parser.parse_filters(request)

        return self.__statistics_service.get_evolution_over_period(
            period,
            account_ids,
            date_from,
            date_to,
            filter_request
        )

    @restipy.route('/aggregation')
    @restipy.format_as(KeyValue)
    def get_aggregation(self) -> List[KeyValue]:
        """Gets the aggregation by period

        :return: the list of (key, value) results
        """
        # Period
        period = request.args.get('period')
        if period is not None:
            period = PeriodType.resolve(period)
        if period is None:
            period = PeriodType.MONTH

        # Filter request
        filter_request = self.__rql_parser.parse_filters(request)

        return self.__statistics_service.get_total_over_period(period, filter_request)

    @restipy.route('/summary')
    @restipy.format_as(Summary)
    def get_summary(self) -> Summary:
        """Gets the summary for the provided filters.

        :return: the summary
        """
        # Account ids
        account_ids = request.args.get('account_ids')
        if account_ids is not None:
            account_ids = account_ids.split(',')
        else:
            account_ids = list(map(lambda x: x.id, self.__account_service.get_all_accounts()))

        # From date
        date_from = request.args.get('date_from')
        if date_from is not None:
            date_from = datetime.strptime(date_from, '%Y-%m-%d').date()
        else:
            date_from = date.today()

        # To date
        date_to = request.args.get('date_to')
        if date_to is not None:
            date_to = datetime.strptime(date_to, '%Y-%m-%d').date()
        else:
            date_to = date.today()

        # Filter request
        filter_request = self.__rql_parser.parse_filters(request)

        return self.__statistics_service.get_summary(account_ids, date_from, date_to, filter_request)

    @restipy.route('/analytics/category')
    @restipy.format_as(CompositeKeyValue)
    def get_analytics_by_category(self) -> List[CompositeKeyValue]:
        """Gets the analytics by category for the provided filters.

        :return: the list of (key_one, key_two, value) results
        """
        # Period
        period = request.args.get('period')
        if period is not None:
            period = PeriodType.resolve(period)
        if period is None:
            period = PeriodType.MONTH

        # Filter request
        filter_request = self.__rql_parser.parse_filters(request)

        return self.__transaction_service.get_total_by_category_over_period(period, filter_request)

    @restipy.route('/analytics/label')
    @restipy.format_as(CompositeKeyValue)
    def get_analytics_by_label(self) -> List[CompositeKeyValue]:
        """Gets the analytics by label for the provided filters.

        :return: the list of (key_one, key_two, value) results
        """
        # Period
        period = request.args.get('period')
        if period is not None:
            period = PeriodType.resolve(period)
        if period is None:
            period = PeriodType.MONTH

        # Filter request
        filter_request = self.__rql_parser.parse_filters(request)

        return self.__transaction_service.get_total_by_label_over_period(period, filter_request)

    @restipy.route('/analytics/repartition')
    @restipy.format_as(CompositeKeyValue)
    def get_analytics_repartition(self) -> List[CompositeKeyValue]:
        """Gets the analytics details for the provided filters.

        :return: the list of (key_one, key_two, value) results
        """
        # Filter request
        filter_request = self.__rql_parser.parse_filters(request)

        return self.__transaction_service.get_total_by_labels_and_type(filter_request)
