from ..modules.restful import DefaultExceptionHandler


class NotAuthenticatedException(Exception):
    pass


class WrongLoginException(Exception):
    pass


class ApplicationExceptionHandler(DefaultExceptionHandler):

    def __init__(self):
        super(ApplicationExceptionHandler, self).__init__()
        self.add(NotAuthenticatedException, 'A403', 'not_authenticated', 403)
        self.add(WrongLoginException, 'A402', 'wrong_login_or_password', 402)
