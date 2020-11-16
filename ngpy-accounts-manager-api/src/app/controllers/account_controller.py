from typing import List

from flask import request

from ..domain.models import Account
from ..domain.services import AccountService, NotificationService
from ..modules import restipy
from ..modules.depynject import injectable
from ..rql_parser import RqlRequestParser


@injectable()
@restipy.prefix('/accounts')
class AccountController:
    """
    The account controller that handles all API requests
    """

    def __init__(self,
                 account_service: AccountService,
                 notification_service: NotificationService
                 ) -> None:
        """Constructor

        :param account_service: the account service
        :param notification_service: the notification service
        """
        self.__account_service = account_service
        self.__notification_service = notification_service
        self.__rql_parser = RqlRequestParser({
            'name': 'name',
            'description': 'description',
            'notify': 'notify',
            'active': 'active'
        })

    @restipy.route('')
    @restipy.format_as(Account)
    def get_all(self) -> List[Account]:
        """Gets all accounts.

        :return: the list of all accounts
        """
        search_request = self.__rql_parser.parse(request)
        return self.__account_service.get_all_accounts(search_request)

    @restipy.route('/<int:account_id>')
    @restipy.format_as(Account)
    def get_one(self, account_id: int) -> Account:
        """Gets an account by its id.

        :param account_id: the account id
        :return: the account
        """
        return self.__account_service.get_account(account_id)

    @restipy.route('/<int:account_id>', methods=['DELETE'])
    def delete_one(self, account_id: int) -> None:
        """Deletes an account by its id.

        :param account_id: the account id
        """
        self.__account_service.delete_account(account_id)

    @restipy.route('', methods=['POST'])
    @restipy.format_as(Account)
    @restipy.parse_as(Account)
    def save_one(self, account: Account) -> Account:
        """Saves an account (create and update)

        :param account: the account to save
        :return the saved account
        """
        return self.__account_service.save_account(account)
