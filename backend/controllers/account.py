from ..domain.models import Account
from ..modules import restipy
from ..modules.depynject import injectable


@injectable()
@restipy.prefix('/accounts')
class AccountController():

    def __init__(self, account_service, notification_service):
        self.account_service = account_service
        self.notification_service = notification_service

    @restipy.route('')
    @restipy.format_as(Account)
    def get_all(self):
        return self.account_service.get_all_accounts()

    @restipy.route('/<int:account_id>')
    @restipy.format_as(Account)
    def get_one(self, account_id):
        return self.account_service.get_account(account_id)

    @restipy.route('/<int:account_id>', methods=['DELETE'])
    def delete_one(self, account_id):
        return self.account_service.delete_account(account_id)

    @restipy.route('', methods=['POST'])
    @restipy.format_as(Account)
    @restipy.parse_as(Account)
    def save_one(self, account):
        return self.account_service.save_account(account)

    @restipy.route('test-email')
    def save_one(self):
        return self.notification_service.send_email()
