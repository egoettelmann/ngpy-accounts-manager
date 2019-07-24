import datetime

from ..models import KeyValue
from ..models import Summary
from ...modules.depynject import injectable


@injectable()
class StatisticsService():

    def __init__(self, object_mapper, transaction_service, account_service):
        self.mapper = object_mapper
        self.transaction_service = transaction_service
        self.account_service = account_service

    def get_aggregation_by_period(self, account_ids=None, year=None, month=None, label_ids=None, sign=None):
        if year is None:
            year = int(datetime.datetime.now().strftime("%Y"))

        return self.transaction_service.get_total_by_period(account_ids, year, month, 'month', label_ids, sign)

    def get_evolution_for_year(self, account_ids=None, year=None):
        if year is None:
            year = int(datetime.datetime.now().strftime("%Y"))
        date_from = datetime.date(year, 1, 1)
        start_amount = 0

        entries = self.transaction_service.get_total_by_period(account_ids, year, None, 'month')

        if account_ids is None:
            account_ids = []
            for acc in self.account_service.get_all_accounts():
                account_ids.append(acc.id)
        for acc_id in account_ids:
            account_total = self.account_service.get_account_total(acc_id, date_from)
            if account_total is not None:
                start_amount = start_amount + account_total

        values = [KeyValue(str(year) + '-01', start_amount)]
        for e in entries:
            if e.value is not None:
                start_amount = start_amount + e.value
            values.append(KeyValue(e.key, start_amount))
        return values

    def get_summary(self, account_ids=None, year=None, month=None, label_ids=None):
        date_from = self.transaction_service.get_date_from(year, month)
        date_to = self.transaction_service.get_date_to(year, month)

        total_debit = self.transaction_service.get_total(account_ids, year, month, False, label_ids)
        total_credit = self.transaction_service.get_total(account_ids, year, month, True, label_ids)
        if account_ids is None:
            account_ids = []
            accounts = self.account_service.get_all_accounts()
            for a in accounts:
                account_ids.append(a.id)
        amount_start = 0
        amount_end = 0
        for acc_id in account_ids:
            amount_start = amount_start + self.account_service.get_account_total(acc_id, date_from)
            amount_end = amount_end + self.account_service.get_account_total(acc_id, date_to)

        period_type = 'YEAR'
        if month is not None:
            period_type = 'MONTH'

        return Summary(
            amount_start,
            amount_end,
            total_credit,
            total_debit,
            period_type
        )
