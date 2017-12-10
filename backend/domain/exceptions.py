from ..modules.restful import DefaultExceptionHandler


class BaseAppException(Exception):

    def __init__(self, message, params=None):
        super(BaseAppException, self).__init__(message)
        self.message = message
        if not params:
            params = {}
        self.params = params

    def __str__(self):
        return self.message


class NotAuthenticatedException(BaseAppException):
    pass


class WrongLoginException(BaseAppException):
    pass


class FileImportException(BaseAppException):
    pass


class ApplicationExceptionHandler(DefaultExceptionHandler):

    def __init__(self):
        super(ApplicationExceptionHandler, self).__init__()
        self.add(NotAuthenticatedException, 'A403', 'not_authenticated', 403)
        self.add(WrongLoginException, 'A400', 'wrong_login_or_password', 400)
        self.add(FileImportException, 'A409', 'file_import_failed', 409)