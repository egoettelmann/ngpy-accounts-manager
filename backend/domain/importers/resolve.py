import csv, logging
from itertools import islice

from .bpalc import Parser as BplacParser
from .ing import Parser as IngParser
from .inglux import Parser as IngLuxParser
from ...modules.depynject import injectable


def nth(iterable, n, default=None):
    """Returns the nth item or a default value"""
    return next(islice(iterable, n, None), default)


@injectable()
class Resolver:

    def resolve(self, filename):
        cr = csv.reader(open(filename, "rt"), delimiter=';')
        num_cols = len(nth(cr, 0))
        if num_cols == 7:
            logging.info('Parsing file as BPALC format')
            return BplacParser(filename)
        elif num_cols == 6 or num_cols == 5:
            logging.info('Parsing file as ING (FR) format')
            return IngParser(filename)
        elif num_cols == 18:
            logging.info('Parsing file as ING (LU) format')
            return IngLuxParser(filename)
        else:
            logging.error('Impossible to find appropriate parser')
            raise ResolveError('Cannot resolve importer for file with ' + str(num_cols) + ' columns')


class ResolveError(Exception):
    def __init__(self, m):
        self.message = m

    def __str__(self):
        return self.message
