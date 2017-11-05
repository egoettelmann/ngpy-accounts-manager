from ...modules.depynject import injectable

from ..models import Summary


@injectable()
class StatisticsService():

    def __init__(self, object_mapper, transaction_service, account_service):
        self.mapper = object_mapper
        self.transaction_service = transaction_service
        self.account_service = account_service

    def get_summary(self, account_ids=None, year=None, month=None):
        date_from = self.transaction_service.get_date_from(year, month)
        date_to = self.transaction_service.get_date_to(year, month)

        total_debit = self.transaction_service.get_total(account_ids, year, month, False)
        total_credit = self.transaction_service.get_total(account_ids, year, month, True)
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
