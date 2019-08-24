from .api import Api
from .converter import Converter
from .errors import DefaultExceptionHandler


# FIXME: Api.route should not be static, but directly called on instance


route = Api.route
prefix = Api.prefix
convertible = Converter.convertible
format_as = Converter.format_as
parse_as = Converter.parse_as
