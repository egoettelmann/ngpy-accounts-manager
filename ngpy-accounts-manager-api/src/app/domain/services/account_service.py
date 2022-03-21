import logging
from datetime import date, datetime, timedelta
from typing import List

from .status_service import StatusService
from .transaction_service import TransactionService
from ..models import Account, Notification
from ..search_request import FilterRequest, FilterOperator, SearchRequest
from ...dbconnector.entities import AccountDbo
from ...dbconnector.repositories import AccountRepository
from ...mapping import Mapper
from ...modules.depynject import injectable


@injectable()
class AccountService:
    """
    The account service class that defines all business operations.
    """

    def __init__(self,
                 account_repository: AccountRepository,
                 object_mapper: Mapper,
                 transaction_service: TransactionService,
                 status_service: StatusService
                 ) -> None:
        """Constructor

        :param account_repository: the account repository
        :param object_mapper: the object mapper
        :param transaction_service: the transaction service
        :param status_service: the status service
        """
        self.__repository = account_repository
        self.__mapper = object_mapper
        self.__transaction_service = transaction_service
        self.__status_service = status_service

    def get_all_accounts(self, search_request: SearchRequest = None) -> List[Account]:
        """Gets the list of all accounts matching the provided filters.

        :param search_request: the search request
        :return: the list of all accounts
        """
        if search_request is None:
            search_request = SearchRequest()
        accounts = self.__mapper.map_all(
            self.__repository.find_all(search_request),
            Account
        )
        for acc in accounts:
            self.__add_metadata(acc)
        return accounts

    def get_account(self, account_id: int) -> Account:
        """Gets an account by its id

        :param account_id: the account id
        :return: the account
        """
        account = self.__mapper.map(
            self.__repository.get_by_id(account_id),
            Account
        )
        self.__add_metadata(account)
        return account

    def find_by_name(self, name: str) -> Account:
        """Finds an account by its name

        :param name: the name of the account
        :return: the account
        """
        return self.__mapper.map(
            self.__repository.find_by_name(name),
            Account
        )

    def delete_account(self, account_id: int) -> None:
        """Deletes an account by its id

        :param account_id: the account id
        """
        self.__repository.delete_by_id(account_id)

    def save_account(self, account: Account) -> Account:
        """Saves an account (create and update)

        :param account: the account to save
        :return the saved account
        """
        saved_account = self.__repository.save_one(
            self.__mapper.map(account, AccountDbo)
        )
        return self.__mapper.map(saved_account, Account)

    def get_last_update(self, account_id: int) -> date:
        """Get the last update of an account by its id.

        :param account_id: the account id
        :return: the last update date
        """
        transaction = self.__transaction_service.get_last_transaction([account_id])
        return transaction.date_value

    def get_account_total(self, account_id: int, start_date: date) -> float:
        """Gets the total of an account at a given date.

        :param account_id: the account id
        :param start_date: the date to calculate the total on
        :return: the total of the account
        """
        last_status = self.__status_service.get_last_account_status(account_id, start_date)
        if last_status is not None:
            total = last_status.value
            date_from = last_status.date
        else:
            total = 0
            date_from = date(1900, 1, 1)
        filter_request = FilterRequest.all(
            FilterRequest.of('account_id', account_id, FilterOperator.EQ),
            FilterRequest.of('date_value', date_from, FilterOperator.GE),
            FilterRequest.of('date_value', start_date, FilterOperator.LT)
        )
        result = self.__transaction_service.get_total(filter_request)
        if result is None:
            result = 0
        return total + result

    def get_notification_levels(self) -> (str, List[Notification]):
        """Gets the notification levels of all accounts.

        :return: the global notification level and the list of notification levels for each account
        """
        accounts_list = self.get_all_accounts()

        max_level = 0
        notification_level = None
        notifications = []

        for acc in accounts_list:
            if not acc.notify:
                continue
            logging.info('Account %s last updated on %s', acc.name, acc.last_update)
            if acc.status is 'ERROR':
                max_level = max(max_level, 3)
                notif = Notification(acc.name, acc.status, str(acc.last_update))
                notifications.append(notif)
                if max_level == 3:
                    notification_level = acc.status
            elif acc.status is 'WARNING':
                max_level = max(max_level, 2)
                notif = Notification(acc.name, acc.status, str(acc.last_update))
                notifications.append(notif)
                if max_level == 2:
                    notification_level = acc.status
            elif acc.last_update is 'INFO':
                max_level = max(max_level, 1)
                notif = Notification(acc.name, acc.status, str(acc.last_update))
                notifications.append(notif)
                if max_level == 1:
                    notification_level = acc.status
        return notification_level, notifications

    def __add_metadata(self, account: Account):
        """Adds the additional metadata to an account:
         - the total
         - the last update

        :param account:
        :return:
        """
        account_id: int = account.id

        # Adding the total
        account.total = self.get_account_total(account_id, date.today() + timedelta(days=1))

        # Adding the last update
        account.last_update = self.get_last_update(account_id)

        # Adding the status
        account.status = self.__calculate_account_status(account)

        return account

    @staticmethod
    def __calculate_account_status(account: Account) -> str:
        """Calculates the account status based on the last update date.

        :param account: the account
        :return: the status
        """
        info_limit = datetime.date(datetime.today() - timedelta(days=30))
        warn_limit = datetime.date(datetime.today() - timedelta(days=60))
        error_limit = datetime.date(datetime.today() - timedelta(days=80))

        if account.last_update < error_limit:
            return 'ERROR'
        elif account.last_update < warn_limit:
            return 'WARNING'
        elif account.last_update < info_limit:
            return 'INFO'
        return 'OK'
