import csv
import logging
from itertools import islice
from typing import List, TypeVar

from .bpalc_parser import BpalcParser
from .ing_parser import IngParser
from .inglux_parser import IngLuxParser
from .parser import Parser
from ...modules.depynject import injectable

T = TypeVar('T')


@injectable()
class Resolver:
    """
    The resolver class that selects the appropriate parser for the file importer
    """

    def nth(self, iterable: List[T], n: int, default: T = None):
        """Returns the nth item or a default value

        :param iterable: the list to get the item from
        :param n: the index of the item
        :param default: the default value
        :return: the item or the default value
        """
        return next(islice(iterable, n, None), default)

    def resolve(self, filename: str) -> Parser:
        """Resolves the parser to use for importing the file

        :param filename: the filename
        :return: the parser
        """
        cr = csv.reader(open(filename, "rt"), delimiter=';')
        num_cols = len(self.nth(cr, 0))
        if num_cols == 7:
            logging.info('Parsing file as BPALC format')
            return BpalcParser(filename)
        elif num_cols == 6 or num_cols == 5:
            logging.info('Parsing file as ING (FR) format')
            return IngParser(filename)
        elif num_cols == 18:
            logging.info('Parsing file as ING (LU) format')
            return IngLuxParser(filename)
        else:
            logging.error('Impossible to find appropriate parser')
            raise ResolveError('Cannot resolve importer for file with %s columns' % str(num_cols))


class ResolveError(Exception):
    """
    The resolve exception
    """

    def __init__(self, m: str):
        self.message = m

    def __str__(self):
        return self.message
