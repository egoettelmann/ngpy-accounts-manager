import csv
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
            print('Parsing as BPALC')
            return BplacParser(filename)
        elif num_cols == 6 or num_cols == 5:
            print('Parsing as ING')
            return IngParser(filename)
        elif num_cols == 18:
            print('Parsing as ING (LUX)')
            return IngLuxParser(filename)
        else:
            raise ResolveError('Cannot resolve importer for file with ' + str(num_cols) + ' columns')


class ResolveError(Exception):
    def __init__(self, m):
        self.message = m

    def __str__(self):
        return self.message
