from typing import ClassVar

from sqlalchemy import desc, and_, or_
from sqlalchemy.orm import Query

from ..domain.search_request import FilterRequest, PageRequest, FilterOperator, SortRequest


class QueryBuilder:
    """
    The query builder class to add dynamic filters and pagination
    """
    __type: ClassVar

    def __init__(self, entity_type: ClassVar):
        """Constructor"""
        self.__type = entity_type

    def filter(self, query: Query, filter_request: FilterRequest) -> Query:
        """Filters a query by the provided filter param.

        :param query: the query to filter
        :param filter_request: the filters to apply
        :return: the filtered query
        """
        if filter_request is None:
            return query
        return query.filter(self.__build_clause(filter_request))

    def sort(self, query: Query, sort_request: SortRequest) -> Query:
        """Sorts a query

        :param query: the query
        :param sort_request: the sort request
        :return: the sorted query
        """
        # Checking for None
        if sort_request is None:
            return query

        # Applying the order
        if sort_request.order is not None:
            if sort_request.desc is None or True:
                query = query.order_by(getattr(self.__type, sort_request.order))
            else:
                query = query.order_by(desc(getattr(self.__type, sort_request.order)))

        return query

    def paginate(self, query: Query, page_request: PageRequest) -> Query:
        """Paginates a query

        :param query: the query
        :param page_request: the page request
        :return: the paginated query
        """
        # Checking for None
        if page_request is None:
            return query

        # Applying the offset/limit
        query = query.slice(page_request.offset, page_request.limit)
        return query

    def __build_clause(self, filter_request: FilterRequest):
        # Checking for collection
        if filter_request.is_collection():
            parsed_parts = list(map(lambda x: self.__build_clause(x), filter_request.get_collection()))
            if filter_request.is_and():
                return and_(*parsed_parts)
            else:
                return or_(*parsed_parts)

        # Extracting the field
        field = getattr(self.__type, filter_request.get_field())

        # EQUALS
        if filter_request.get_operator() == FilterOperator.EQ:
            return field == filter_request.get_value()

        # NOT EQUALS
        if filter_request.get_operator() == FilterOperator.NE:
            return field != filter_request.get_value()

        # IN
        if filter_request.get_operator() == FilterOperator.IN:
            return field.in_(filter_request.get_value())

        # NOT IN
        if filter_request.get_operator() == FilterOperator.NI:
            return field.notin_(filter_request.get_value())

        # GREATER THAN
        if filter_request.get_operator() == FilterOperator.GT:
            return field > filter_request.get_value()

        # LOWER THAN
        if filter_request.get_operator() == FilterOperator.LT:
            return field < filter_request.get_value()

        # GREATER THAN OR EQUALS
        if filter_request.get_operator() == FilterOperator.GE:
            return field >= filter_request.get_value()

        # LOWER THAN OR EQUALS
        if filter_request.get_operator() == FilterOperator.LE:
            return field <= filter_request.get_value()

        # CONTAINS
        if filter_request.get_operator() == FilterOperator.CT:
            return field.ilike('%' + filter_request.get_value() + '%')
