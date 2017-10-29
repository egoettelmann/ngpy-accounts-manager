import datetime

from sqlalchemy.sql.expression import extract, func, desc

from ..models.DBManager import DBManager
from ..models.MapperManager import MapperManager
from ..models.domain.KeyValue import KeyValue
from ..models.domain.Summary import Summary
from ..models.entities.AccountDbo import AccountDbo
from ..models.entities.LabelDbo import LabelDbo
from ..models.entities.StatusDbo import StatusDbo
from ..models.entities.TransactionDbo import TransactionDbo


class StatisticsService():
    mapper = MapperManager.getInstance()

    def get_grouped_by_labels(self, year=None, month=None, account_ids=None):
        result = []
        entries = DBManager.getSession().query(
            LabelDbo.name.label('label'),
            func.sum(TransactionDbo.amount).label('value')
        ).join(
            LabelDbo.transactions
        )
        entries = self.filter_transactions_by_year(entries, year)
        entries = self.filter_transactions_by_month(entries, month)
        entries = self.filter_transactions_by_accounts(entries, account_ids)
        entries = entries.group_by(LabelDbo.id)
        for row in entries.all():
            result.append(KeyValue(row.label, row.value))
        return result

    def get_summary(self, year=None, month=None):
        query = DBManager.getSession().query(func.sum(TransactionDbo.amount).label("total"))
        query = self.filter_transactions_by_year(query, year)
        query = self.filter_transactions_by_month(query, month)
        queryDebit = query.filter(
            TransactionDbo.amount < 0
        )
        queryCredit = query.filter(
            TransactionDbo.amount >= 0
        )
        amount_start = 0
        accounts = AccountDbo.query.all()
        for acc in accounts:
            amount_start = amount_start + self.get_account_status(acc.id, year, month, 1)
        total_debit = queryDebit.scalar()
        total_credit = queryCredit.scalar()
        amount_end = amount_start + total_credit + total_debit
        return Summary(
            amount_start,
            amount_end,
            total_credit,
            total_debit
        )

    def get_last_status(self, account_id, date=None):
        status = StatusDbo.query.filter(StatusDbo.account_id == account_id)
        status = status.order_by(desc(StatusDbo.date))
        if date is not None:
            status = status.filter(StatusDbo.date < date)
        return status.first()

    def get_account_status(self, account_id, year=None, month=None, day=None):
        if year is None:
            year = int(datetime.datetime.now().strftime("%Y"))
        if month is None:
            month = int(datetime.datetime.now().strftime("%m"))
        if day is None:
            day = int(datetime.datetime.now().strftime("%d"))
        end_date = datetime.date(year, month, day)

        status = self.get_last_status(account_id, end_date)
        if status:
            begin_amount = status.value
            begin_date = status.date
        else:
            begin_amount = 0
            begin_date = datetime.date(1900, 1, 1)

        query = DBManager.getSession().query(func.sum(TransactionDbo.amount).label("total"))
        query = query.filter(TransactionDbo.account_id == account_id)
        query = query.filter(TransactionDbo.date_value >= begin_date)
        query = query.filter(TransactionDbo.date_value < end_date)
        total = query.scalar()
        if total is None:
            total = 0
        return begin_amount + total

    @staticmethod
    def filter_transactions_by_accounts(query, account_ids):
        if account_ids:
            ids = []
            for account_id in account_ids:
                a = AccountDbo.query.get(account_id)
                if a:
                    ids.append(a.id)
            query = query.filter(TransactionDbo.account_id.in_(ids))
        return query

    @staticmethod
    def filter_transactions_by_year(query, year):
        if year:
            query = query.filter(
                extract('year', TransactionDbo.date_value) == year
            )
        return query

    @staticmethod
    def filter_transactions_by_month(query, month):
        if month:
            query = query.filter(
                extract('month', TransactionDbo.date_value) == month
            )
        return query

    @staticmethod
    def filter_transactions_by_labels(query, labels=[]):
        if labels:
            ids = []
            for label in labels:
                l = LabelDbo.query.filter(LabelDbo.name == label).first()
                if l:
                    ids.append(l.id)
            query = query.filter(TransactionDbo.label_id.in_(ids))
        return query
