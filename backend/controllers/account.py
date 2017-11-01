from .. import restful
from ..depynject import injectable


@injectable()
@restful.prefix('')
class AccountController():

    def __init__(self, account_service):
        self.account_service = account_service

    @restful.route('/accounts')
    def get(self, account_id=None):
        if account_id is None:
            return self.account_service.get_all()
        else:
            return self.account_service.get_by_id(account_id)
