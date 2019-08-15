import hashlib
import logging
from datetime import date, datetime, timedelta
from typing import List

from .status_service import StatusService
from .transaction_service import TransactionService
from ..exceptions import FileImportException
from ..importers.resolve import Resolver
from ..models import Account, Notification
from ...dbconnector.entities import AccountDbo
from ...dbconnector.entities import TransactionDbo
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
                 status_service: StatusService,
                 resolver: Resolver
                 ) -> None:
        """Constructor

        :param account_repository: the account repository
        :param object_mapper: the object mapper
        :param transaction_service: the transaction service
        :param status_service: the status service
        :param resolver: the import resolver
        """
        self.__repository = account_repository
        self.__mapper = object_mapper
        self.__transaction_service = transaction_service
        self.__status_service = status_service
        self.__resolver = resolver

    def get_all_accounts(self) -> List[Account]:
        """Gets the list of all accounts

        :return: the list of all accounts
        """
        accounts = self.__mapper.map_all(
            self.__repository.get_all(),
            Account
        )
        for acc in accounts:
            acc_id: int = acc.id
            acc.total = self.get_account_total(acc_id, date.today() + timedelta(days=1))
            acc.last_update = self.get_last_update(acc_id)
        return accounts

    def get_account(self, account_id: int) -> Account:
        """Gets an account by its id

        :param account_id: the account id
        :return: the account
        """
        return self.__mapper.map(
            self.__repository.get_by_id(account_id),
            Account
        )

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
        result = self.__repository.get_total(account_id, date_from, start_date)
        if result is None:
            result = 0
        return total + result

    def import_file(self, filename: str) -> bool:
        """Imports a file of transactions.

        :param filename: the file to import
        :return: if the import was successful or not
        """
        parser = self.__resolver.resolve(filename)
        account_name = parser.get_account_name()
        account = self.find_by_name(account_name)
        transactions = self.__mapper.map_all(
            parser.parse(),
            TransactionDbo
        )
        for t in transactions:
            t.account_id = account.id
            s = str(t.account_id) + t.reference + t.date_value.strftime("%Y-%m-%d") + "{0:.2f}".format(t.amount)
            t.hash = hashlib.md5(s.encode('utf-8')).hexdigest()
        try:
            return self.__transaction_service.create_all(transactions)
        except Exception as e:
            raise FileImportException("Impossible to import file", cause=e)

    def get_notification_levels(self) -> (str, List[Notification]):
        """Gets the notification levels of all accounts.

        :return: the global notification level and the list of notification levels for each account
        """
        accounts_list = self.get_all_accounts()

        info_limit = datetime.date(datetime.today() - timedelta(days=30))
        warn_limit = datetime.date(datetime.today() - timedelta(days=60))
        error_limit = datetime.date(datetime.today() - timedelta(days=80))

        max_level = 0
        notification_level = None
        notifications = []

        for acc in accounts_list:
            if not acc.notify:
                continue
            logging.info('Account %s last updated on %s', acc.name, acc.last_update)
            if acc.last_update < error_limit:
                max_level = max(max_level, 3)
                notif = Notification(acc.name, 'ERROR', str(acc.last_update))
                notifications.append(notif)
                if max_level == 3:
                    notification_level = 'ERROR'
            elif acc.last_update < warn_limit:
                max_level = max(max_level, 2)
                notif = Notification(acc.name, 'WARNING', str(acc.last_update))
                notifications.append(notif)
                if max_level == 2:
                    notification_level = 'WARNING'
            elif acc.last_update < info_limit:
                max_level = max(max_level, 1)
                notif = Notification(acc.name, 'INFO', str(acc.last_update))
                notifications.append(notif)
                if max_level == 1:
                    notification_level = 'INFO'
        return notification_level, notifications
