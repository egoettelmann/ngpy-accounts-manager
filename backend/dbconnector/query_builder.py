import logging
from typing import ClassVar, Optional, List

from sqlalchemy import desc, and_, or_
from sqlalchemy.orm import Query

from ..domain.search_request import FilterRequest, PageRequest, FilterOperator, SortRequest


class QueryTemplate:
    """
    The query template class to build the final query
    """
    query: Query
    __type: ClassVar
    __joins: List[any]

    def __init__(self, query: Query, entity_type: ClassVar):
        """Constructor"""
        self.query = query
        self.__type = entity_type
        self.__joins = []

    def filter(self, filter_request: FilterRequest):
        """Filters a query by the provided filter param.

        :param filter_request: the filters to apply
        :return: the filtered query
        """
        clause = self.__build_clause(filter_request)
        if clause is None:
            return
        self.query = self.query.filter(clause)

    def sort(self, sort_request: SortRequest):
        """Sorts a query

        :param sort_request: the sort request
        :return: the sorted query
        """
        # Checking for None
        if sort_request is None:
            return

        # Applying the order
        if sort_request.order is not None:
            attr = self.get_nested_attribute(self.__type, sort_request.order)
            if sort_request.desc is None or sort_request.desc is False:
                self.query = self.query.order_by(attr)
            else:
                self.query = self.query.order_by(desc(attr))

    def paginate(self, page_request: PageRequest):
        """Paginates a query

        :param page_request: the page request
        :return: the paginated query
        """
        # Checking for None
        if page_request is None:
            return

        # Applying the offset/limit
        self.query = self.query.slice(page_request.offset, page_request.limit)

    def group(self, groups: List[str]):
        """Groups a query on multiple clauses

        :param groups: the group list
        :return: the paginated query
        """
        # Checking for None
        if groups is None or len(groups) == 0:
            return

        # Applying the groups
        for group in groups:
            self.query = self.query.group_by(self.get_nested_attribute(self.__type, group))

    def get_nested_attribute(self, o: any, attr: str):
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
            target = item.property.mapper.class_
            if target not in self.__joins:
                self.query = self.query.join(item)
                self.__joins.append(target)
            return self.get_nested_attribute(target, attrs[1])

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
        field = self.get_nested_attribute(self.__type, filter_request.get_field())
        operator = filter_request.get_operator()
        value = filter_request.get_value()

        # EQUALS
        if operator == FilterOperator.EQ:
            return field == value

        # NOT EQUALS
        if operator == FilterOperator.NE:
            return field != value

        # IN
        if operator == FilterOperator.IN:
            if None in value:
                return or_(
                    field.is_(None),
                    field.in_(value)
                )
            return field.in_(value)

        # NOT IN
        if operator == FilterOperator.NI:
            if None in value:
                return and_(
                    field.isnot_(None),
                    field.notin_(value)
                )
            return field.notin_(value)

        # GREATER THAN
        if operator == FilterOperator.GT:
            return field > value

        # LOWER THAN
        if operator == FilterOperator.LT:
            return field < value

        # GREATER THAN OR EQUALS
        if operator == FilterOperator.GE:
            return field >= value

        # LOWER THAN OR EQUALS
        if operator == FilterOperator.LE:
            return field <= value

        # CONTAINS
        if operator == FilterOperator.CT:
            return field.ilike('%' + value + '%')


class QueryBuilder:
    """
    The query builder class to add dynamic filters and pagination
    """
    __type: ClassVar

    def __init__(self, entity_type: ClassVar):
        """Constructor"""
        self.__type = entity_type

    def build(self,
              query: Query,
              filters: FilterRequest = None,
              sort: SortRequest = None,
              paginate: PageRequest = None,
              groups: List[str] = []
              ) -> Query:
        """Filters a query by the provided filter param.

        :param query: the query to filter
        :param filters: the filters to apply
        :param sort: the sort request
        :param paginate: the page request
        :param groups: the group by clauses
        :return: the filtered query
        """
        query_template = QueryTemplate(query, self.__type)
        if filters is not None:
            query_template.filter(filters)
        if sort is not None:
            query_template.sort(sort)
        if paginate is not None:
            query_template.paginate(paginate)
        if groups is not None:
            query_template.group(groups)
        return query_template.query
