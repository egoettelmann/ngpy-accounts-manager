import logging
import urllib.parse
from typing import Mapping, Optional

from flask import Request

from .domain.search_request import SearchRequest, FilterOperator, PageRequest, SortRequest, FilterRequest


class RqlParserOptions:
    """
    The RQL parser options class to configure the parser
    """
    max_page_size: int
    default_page_size: int
    page_attribute: str
    page_size_attribute: str
    sort_attribute: str
    sort_direction_attribute: str
    rql_attribute: str

    def __init__(self,
                 max_page_size: int = 500,
                 default_page_size: int = 100,
                 page_attribute: str = 'page',
                 page_size_attribute: str = 'page_size',
                 sort_attribute: str = 'sort',
                 sort_direction_attribute: str = 'sort_direction',
                 rql_attribute: str = 'rql'
                 ):
        """Constructor"""
        self.max_page_size = max_page_size
        self.default_page_size = default_page_size
        self.page_attribute = page_attribute
        self.page_size_attribute = page_size_attribute
        self.sort_attribute = sort_attribute
        self.sort_direction_attribute = sort_direction_attribute
        self.rql_attribute = rql_attribute


class RqlRequestParser:
    """
    The RQL request parser class
    """
    __allowed_params: Mapping[str, str]
    __parser_options: RqlParserOptions

    def __init__(self, allowed_params: Mapping[str, str], parser_options: RqlParserOptions = None):
        """Constructor"""
        self.__allowed_params = allowed_params
        self.__parser_options = parser_options
        if self.__parser_options is None:
            self.__parser_options = RqlParserOptions()

    def parse(self, request: Request) -> SearchRequest:
        """Parses the request into a RQL request object

        :param request: the request to extract all parameters from
        :return: the RQL request object
        """
        rql_request = SearchRequest()

        # Parsing the sort request
        rql_request.sort_request = self.__parse_sort(request)
        logging.debug('RqlParser: parsed sort %s', rql_request.sort_request)

        # Parsing the pagination request
        rql_request.page_request = self.__parse_pagination(request)
        logging.debug('RqlParser: parsed pagination %s', rql_request.page_request)

        # Parsing the filter request
        rql_request.filter_param = self.__parse_filters(request)
        logging.debug('RqlParser: parsed filters %s', rql_request.filter_param)
        return rql_request

    def __parse_sort(self, request: Request) -> SortRequest:
        """Parses the request to build the sort request object

        :param request: the request to extract all parameters from
        :return: the sort request object
        """
        sort_request = SortRequest()

        # Defining the order
        sort = request.args.get(self.__parser_options.sort_attribute)
        sort_direction = request.args.get(self.__parser_options.sort_direction_attribute)
        if sort is not None and sort in self.__allowed_params:
            sort_request.order = self.__allowed_params[sort]
            sort_request.desc = sort_direction is not None and sort_direction == 'DESC'

        return sort_request

    def __parse_pagination(self, request: Request) -> PageRequest:
        """Parses the request to build the pagination request object

        :param request: the request to extract all parameters from
        :return: the page request object
        """
        page_request = PageRequest()

        # Defining the limit
        page_size = request.args.get(self.__parser_options.page_size_attribute)
        if page_size is None:
            page_request.limit = self.__parser_options.default_page_size
        else:
            page_request.limit = int(page_size)
        if page_request.limit > self.__parser_options.max_page_size:
            logging.warning('RqlParser: page limit {%s} is above max', page_request.limit)
            page_request.limit = self.__parser_options.max_page_size

        # Defining the offset
        page = request.args.get(self.__parser_options.page_attribute)
        if page is None:
            page_request.offset = 0
        else:
            page_request.offset = (int(page) - 1) * page_request.limit

        return page_request

    def __parse_filters(self, request: Request) -> Optional[FilterRequest]:
        """Parses the request to build the filter param object

        :param request: the request to extract all parameters from
        :return: the filter param object
        """
        rql_expression = request.args.get(self.__parser_options.rql_attribute)
        return self.__parse_rql_expression(rql_expression)

    def __parse_rql_expression(self, rql_expression: str) -> Optional[FilterRequest]:
        """Parses an RQL expression into an optional filter param

        :param rql_expression: the expression to parse
        :return: the filter param object
        """
        if rql_expression is None:
            logging.info('RqlParser: no filters supplied')
            return None
        start = rql_expression.find('(')
        end = rql_expression.rfind(')')
        if start == -1 or end == -1:
            logging.warning('RqlParser: could not parse expression {%s}', rql_expression)
            return None

        # Extracting the outer operator
        outer = rql_expression[0:start]

        # Extracting the inner expression
        inner = rql_expression[start+1:end]

        # Checking for aggregations
        if outer == 'or' or outer == 'and':
            parts = inner.split(';')
            parsed_parts = list(map(lambda x: self.__parse_rql_expression(x), parts))
            parsed_parts = [x for x in parsed_parts if x is not None]
            if len(parsed_parts) == 0:
                logging.warning('RqlParser: empty list of aggregation for {%s}', outer)
                return None
            if outer == 'or':
                return FilterRequest.either(*parsed_parts)
            else:
                return FilterRequest.all(*parsed_parts)

        # Looking up the operator
        operator: FilterOperator = None
        for op in FilterOperator:
            if outer == op.value:
                operator = op
        if operator is None:
            logging.warning('RqlParser: unknown operator {%s}', outer)
            return None

        # Extracting the field and the URI encoded value
        (field, value) = inner.split(',', 1)

        # Checking that the field is allowed
        if field not in self.__allowed_params:
            logging.warning('RqlParser: filter on field {%s} is not allowed', field)
            return None

        # Building the filter param
        return FilterRequest.of(
            self.__allowed_params[field],
            urllib.parse.unquote(value),
            operator
        )
