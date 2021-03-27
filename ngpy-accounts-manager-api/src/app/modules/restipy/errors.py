import logging

from .types import String as StringType
from .converter import Converter


@Converter.convertible({
    'code': StringType(),
    'message': StringType()
})
class ErrorMessage:

    def __init__(self, code, message):
        self.code = code
        self.message = message


class DefaultExceptionHandler:

    def __init__(self):
        self.exceptions = []
        self.add(Exception, 'T500')

    def add(self, exception_ref, code, message='internal_error', http_status=500):
        self.exceptions.append({
            'reference': exception_ref,
            'error': ErrorMessage(code, message),
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
                self.build(self.exceptions[idx]['error']),
                self.exceptions[idx]['status']
            )
        else:
            return self.handle(e, idx - 1)

    @Converter.format_as(ErrorMessage)
    def build(self, em):
        return em
