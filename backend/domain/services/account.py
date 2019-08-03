from datetime import date, datetime, timedelta
import hashlib
import logging

from ..exceptions import FileImportException
from ..models import Account, Notification
from ...dbconnector.entities import AccountDbo
from ...dbconnector.entities import TransactionDbo
from ...modules.depynject import injectable


@injectable()
class AccountService():

    def __init__(self, account_repository, object_mapper, transaction_service, status_service, resolver):
        self.repository = account_repository
        self.mapper = object_mapper
        self.transaction_service = transaction_service
        self.status_service = status_service
        self.resolver = resolver

    def get_all_accounts(self):
        accounts = self.mapper.map_all(
            self.repository.get_all(),
            Account
        )
        for acc in accounts:
            acc.total = self.get_account_total(acc.id)
            acc.last_update = self.get_last_update(acc.id)
        return accounts

    def get_account(self, account_id):
        return self.mapper.map(
            self.repository.get_by_id(account_id),
            Account
        )

    def find_by_name(self, name):
        return self.mapper.map(
            self.repository.find_by_name(name),
            Account
        )

    def delete_account(self, account_id):
        self.repository.delete_by_id(account_id)

    def save_account(self, account):
        self.repository.save_one(
            self.mapper.map(account, AccountDbo)
        )

    def get_last_update(self, account_id):
        transaction = self.transaction_service.get_last_transaction([account_id])
        return transaction.date_value

    def get_account_total(self, account_id, start_date=None):
        last_status = self.status_service.get_last_account_status(account_id, start_date)
        if last_status is not None:
            total = last_status.value
            date_from = last_status.date
        else:
            total = 0
            date_from = date(1900, 1, 1)
        result = self.repository.get_total(account_id, date_from, start_date)
        if result is None:
            result = 0
        return total + result

    def import_file(self, filename):
        parser = self.resolver.resolve(filename)
        account_name = parser.get_account_name()
        account = self.find_by_name(account_name)
        transactions = self.mapper.map_all(
            parser.parse(),
            TransactionDbo
        )
        for t in transactions:
            t.account_id = account.id
            s = str(t.account_id) + t.reference + t.date_value.strftime("%Y-%m-%d") + "{0:.2f}".format(t.amount)
            t.hash = hashlib.md5(s.encode('utf-8')).hexdigest()
        try:
            return self.transaction_service.create_all(transactions)
        except Exception as e:
            raise FileImportException("Impossible to import file", cause=e)

    def get_notification_levels(self):
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
