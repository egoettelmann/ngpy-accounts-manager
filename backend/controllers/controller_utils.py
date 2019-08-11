from datetime import datetime

from flask import Request

from ..domain.models import FilterCriteria, PageRequest


class ControllerUtils:
    """
    The controller utils class with some helper methods
    """
    DEFAULT_PAGE_SIZE = 500
    MAX_PAGE_SIZE = 500

    @staticmethod
    def extract_filter_criteria(request: Request) -> FilterCriteria:
        """Extracts a filter criteria object from the request.

        :return: the filter criteria object
        """
        filter_criteria = FilterCriteria()

        # Defining the account ids
        account_ids = request.args.get('account_ids')
        if account_ids is not None:
            filter_criteria.account_ids = list(map(lambda a: int(a), account_ids.split(',')))

        # Defining the label ids
        label_ids = request.args.get('label_ids')
        if label_ids is not None:
            filter_criteria.label_ids = list(
                map(lambda a: None if (a == '' or a == 'null') else int(a), label_ids.split(','))
            )

        # Defining the category_type
        category_type = request.args.get('category_type')
        if category_type is not None:
            filter_criteria.category_type = category_type

        # Defining the date_from
        date_from = request.args.get('from')
        if date_from is not None:
            filter_criteria.date_from = datetime.strptime(date_from, '%Y-%m-%d')

        # Defining the date_to
        date_to = request.args.get('to')
        if date_to is not None:
            filter_criteria.date_to = datetime.strptime(date_to, '%Y-%m-%d')

        # Defining the reference
        reference = request.args.get('reference')
        if reference is not None:
            filter_criteria.reference = reference

        # Defining the description
        description = request.args.get('description')
        if description is not None:
            filter_criteria.description = description

        # Defining the amount_min
        amount_min = request.args.get('min')
        if amount_min is not None:
            filter_criteria.amount_min = amount_min

        # Defining the amount_max
        amount_max = request.args.get('max')
        if amount_max is not None:
            filter_criteria.amount_max = amount_max

        return filter_criteria

    @staticmethod
    def extract_page_request(request: Request) -> PageRequest:
        """Extracts a page request object from the request.

        :return: the page request object
        """
        page_request = PageRequest()

        # Defining the limit
        page_size = request.args.get('page_size')
        if page_size is None:
            page_request.limit = ControllerUtils.DEFAULT_PAGE_SIZE
        else:
            page_request.limit = int(page_size)
        if page_request.limit > ControllerUtils.MAX_PAGE_SIZE:
            page_request.limit = ControllerUtils.MAX_PAGE_SIZE

        # Defining the offset
        page = request.args.get('page')
        if page is None:
            page_request.offset = 0
        else:
            page_request.offset = (int(page) - 1) * page_request.limit

        # Defining the order
        sort = request.args.get('sort')
        sort_direction = request.args.get('sort_direction')
        if sort is not None:
            page_request.order = sort
            page_request.desc = sort_direction is not None and sort_direction == 'DESC'
        return page_request
