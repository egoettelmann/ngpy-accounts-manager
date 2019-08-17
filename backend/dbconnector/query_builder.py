import logging
from typing import ClassVar, Optional

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
        clause = self.__build_clause(filter_request)
        if clause is None:
            return query
        return query.filter(clause)

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
            if sort_request.desc is None or sort_request.desc is False:
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

    def __build_clause(self, filter_request: FilterRequest) -> Optional[any]:
        """Builds a filter clause from a provided filter request.

        :param filter_request: the filter request
        :return: the filter clause
        """
        # Checking for none
        if filter_request is None:
            return None

        # Checking for collection
        if filter_request.is_collection():
            # Building the collection clause
            parsed_parts = list(
                filter(
                    lambda x: x is not None,
                    map(
                        lambda x: self.__build_clause(x),
                        filter_request.get_collection()
                    )
                )
            )
            if len(parsed_parts) == 0:
                return None
            if filter_request.is_and():
                return and_(*parsed_parts)
            else:
                return or_(*parsed_parts)

        # Extracting the field
        field = self.__get_nested_attr(self.__type, filter_request.get_field())
        operator = filter_request.get_operator()

        # EQUALS
        if operator == FilterOperator.EQ:
            return field == filter_request.get_value()

        # NOT EQUALS
        if operator == FilterOperator.NE:
            return field != filter_request.get_value()

        # IN
        if operator == FilterOperator.IN:
            values = filter_request.get_value()
            if None in values:
                return or_(
                    field.is_(None),
                    field.in_(values)
                )
            return field.in_(values)

        # NOT IN
        if operator == FilterOperator.NI:
            values = filter_request.get_value()
            if None in values:
                return and_(
                    field.isnot_(None),
                    field.notin_(values)
                )
            return field.notin_(values)

        # GREATER THAN
        if operator == FilterOperator.GT:
            return field > filter_request.get_value()

        # LOWER THAN
        if operator == FilterOperator.LT:
            return field < filter_request.get_value()

        # GREATER THAN OR EQUALS
        if operator == FilterOperator.GE:
            return field >= filter_request.get_value()

        # LOWER THAN OR EQUALS
        if operator == FilterOperator.LE:
            return field <= filter_request.get_value()

        # CONTAINS
        if operator == FilterOperator.CT:
            return field.ilike('%' + filter_request.get_value() + '%')

    @staticmethod
    def __get_nested_attr(o, attr):
        """Gets the attribute with support for 'dot' notation.
        Will extract the nested attribute from the provided object.

        :param o: the object
        :param attr: the attribute to extract
        :return: the extract attribute
        """
        logging.debug('Retrieving [%s] from %s', attr, o)
        attrs = attr.split('.', 1)
        item = getattr(o, attrs[0])
        if len(attrs) == 1:
            return item
        else:
            return QueryBuilder.__get_nested_attr(
                item.property.mapper.class_,
                attrs[1]
            )
