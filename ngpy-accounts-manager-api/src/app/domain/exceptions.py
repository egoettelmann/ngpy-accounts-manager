from sqlalchemy.exc import OperationalError

from ..modules.restipy import DefaultExceptionHandler


class BaseAppException(Exception):
    """
    The base app exception class that all other app specific exception can/should extend
    """

    def __init__(self, message: str, context: dict = None, cause: Exception = None):
        """Constructor

        :param message: the message
        :param context: the context of the exception
        :param cause: the original exception
        """
        super(BaseAppException, self).__init__(message)
        self.message = message
        if not context:
            context = {}
        self.context = context
        self.cause = cause

    def __str__(self):
        """String representation for logging
        :return:
        """
        msg = self.message
        if self.cause:
            msg += '\n\t caused by: %s' % self.cause
        return msg


class NotFoundException(BaseAppException):
    """
    The not found exception
    """
    pass


class NotAuthenticatedException(BaseAppException):
    """
    The not authenticated exception
    """
    pass


class WrongLoginException(BaseAppException):
    """
    The wrong login exception
    """
    pass


class FileImportException(BaseAppException):
    """
    The file import exception
    """
    def __init__(self, message: str, cause: Exception = None):
        context = {'reason': message}
        super().__init__(message, context, cause)


class DuplicateElementsException(BaseAppException):
    """
    The duplicate elements exception
    """
    pass


class ApplicationExceptionHandler(DefaultExceptionHandler):
    """
    The application exception handler that binds every exception to an error message.
    The binding is done with the following params:
     - an error core
     - an error message that can be used as translation key
     - an HTTP status code
    """

    def __init__(self):
        """Constructor
        Declares all bindings
        """
        super(ApplicationExceptionHandler, self).__init__()
        self.add(WrongLoginException, 'A400', 'wrong_login_or_password', 400)
        self.add(NotAuthenticatedException, 'A401', 'not_authenticated', 401)
        self.add(NotFoundException, 'A404', 'not_found', 404)
        self.add(FileImportException, 'A409', 'file_import_failed', 409)
        self.add(OperationalError, 'A503', 'app_not_ready', 503)
