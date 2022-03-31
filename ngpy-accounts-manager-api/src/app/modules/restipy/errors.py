import logging

from .types import String as StringType, Raw as RawType
from .converter import Converter


@Converter.convertible({
    'code': StringType(),
    'message': StringType(),
    'context': RawType()
})
class RestError:

    def __init__(self, code, message, context: dict = None):
        self.code = code
        self.message = message
        self.context = {} if context is None else context


class DefaultExceptionHandler:

    def __init__(self):
        self.exceptions = []
        self.add(Exception, 'T500')

    def add(self, exception_ref, code, message='internal_error', http_status=500):
        self.exceptions.append({
            'reference': exception_ref,
            'code': code,
            'message': message,
            'status': http_status
        })

    def handle(self, e, idx=None):
        if idx is None:
            idx = len(self.exceptions) - 1
        if idx >= len(self.exceptions) or idx < 0:
            logging.error('An unhandled error occurred: %s', e)
            raise e
        if isinstance(e, self.exceptions[idx]['reference']):
            logging.error('An error occurred while handling request: %s', e)
            return (
                self.build(
                    self.exceptions[idx]['code'],
                    self.exceptions[idx]['message'],
                    e
                ),
                self.exceptions[idx]['status']
            )
        else:
            return self.handle(e, idx - 1)

    @Converter.format_as(RestError)
    def build(self, code: str, message: str, e: any = None):
        context = {}
        if hasattr(e, 'context'):
            context = e.context
        return RestError(code, message, context)
