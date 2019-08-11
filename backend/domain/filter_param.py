from enum import Enum
from typing import List


class PageRequest:
    """
    The paginated request class
    """
    offset: int
    limit: int
    order: str
    desc: bool

    def __init__(self, offset: int = None, limit: int = None, order: str = None, desc: bool = None):
        """Constructor"""
        self.offset = offset
        self.limit = limit
        self.order = order
        self.desc = desc

    def __repr__(self):
        """Formats the page request for display

        :return: the string representation
        """
        direction = 'desc' if self.desc is True else 'asc'
        return '<Page [%s-%s] %s(%s)>' % (self.offset, self.offset + self.limit, direction, self.order)


class FilterOperator(Enum):
    """
    The enumeration of available filter operators
    """
    EQ = 'eq'  # EQUALS the value
    NE = 'ne'  # NOT EQUALS the value
    IN = 'in'  # IN the list of values
    NI = 'ni'  # NOT IN the list of values
    GT = 'gt'  # GREATER THAN the numeric value
    LT = 'lt'  # LOWER THAN the numeric value
    GE = 'ge'  # GREATER THAN OR EQUALS the numeric value
    LE = 'le'  # LOWER THAN OR EQUALS the numeric value
    CT = 'ct'  # CONTAINS the textual value


class FilterParam:
    """
    The filter param class.
    Each instance can be either:
      - a tuple of (field, value, operator)
      - a collection of filter params aggregated by 'and' or 'or' (defined by the 'is_and' field)
    """
    __operator: FilterOperator
    __field: str
    __value: any
    __collection: List['FilterParam']
    __is_and: bool

    def __init__(self):
        """Constructor"""
        self.__operator = None
        self.__field = None
        self.__value = None
        self.__collection = None
        self.__is_and = None

    @staticmethod
    def of(field: str, value: any, operator: FilterOperator) -> 'FilterParam':
        """Builds a filter param

        :param field: the field to filter on
        :param value: the value to filter
        :param operator: the operator to use
        :return: the built filter param
        """
        fp = FilterParam()
        fp.__field = field
        fp.__value = value
        fp.__operator = operator
        return fp

    @staticmethod
    def all(*args: List['FilterParam']) -> 'FilterParam':
        """Builds a list of filter params aggregated by 'and'

        :param args: the list of filter params to aggregate
        :return: the filter param
        """
        fp = FilterParam()
        fp.__is_and = True
        fp.__collection = args
        return fp

    @staticmethod
    def either(*args: List['FilterParam']) -> 'FilterParam':
        """Builds a list of filter params aggregated by 'or'

        :param args: the list of filter params to aggregate
        :return: the filter param
        """
        fp = FilterParam()
        fp.__is_and = False
        fp.__collection = args
        return fp

    def is_collection(self) -> bool:
        """Checks if the instance is a collection of filter params.

        :return: true if it is a collection
        """
        return self.__collection is not None

    def is_and(self) -> bool:
        """Checks if the collection is aggregated by 'and'

        :return: true if the collection should be aggregated by 'and'
        """
        return self.__is_and is True

    def get_collection(self) -> List['FilterParam']:
        """Gets the collection of filter params

        :return: the collection of filter params
        """
        return self.__collection

    def get_operator(self) -> FilterOperator:
        """Gets the operator of the filter param

        :return: the operator to apply
        """
        return self.__operator

    def get_field(self) -> str:
        """Gets the field of the filter param

        :return: the field to filter on
        """
        return self.__field

    def get_value(self) -> any:
        """Gets the value of the filter param

        :return: the value to use for the filter
        """
        return self.__value

    def __as_string(self) -> str:
        """Formats the filter param for display

        :return: the string representation
        """
        result = ''
        if self.is_collection():
            if self.is_and():
                result += 'and('
            else:
                result += 'or('
            items = list(map(lambda x: x.__as_string(), self.__collection))
            result += ';'.join(items)
        else:
            result += self.__operator.value + '('
            result += self.__field
            result += ', '
            result += self.__value
        result += ')'
        return result

    def __repr__(self):
        """Formats the filter param for display

        :return: the string representation
        """
        return '<RQL ' + self.__as_string() + '>'
