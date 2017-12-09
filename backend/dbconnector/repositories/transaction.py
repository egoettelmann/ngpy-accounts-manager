from sqlalchemy.sql.expression import extract, func

from ..entities import LabelDbo, TransactionDbo
from ...modules.depynject import injectable


@injectable()
class TransactionRepository():

    def __init__(self, entity_manager):
        self.entity_manager = entity_manager

    def get_all(self, account_ids=None, date_from=None, date_to=None):
        query = self.entity_manager.query(TransactionDbo)
        query = self.filter_by_accounts(query, account_ids)
        query = self.filter_by_date_from(query, date_from)
        query = self.filter_by_date_to(query, date_to)
        return query.order_by(TransactionDbo.date_value)

    def get_by_id(self, transaction_id):
        return self.entity_manager.query(TransactionDbo).get(transaction_id)

    def get_grouped_by_labels(self, account_ids=None, date_from=None, date_to=None, sign=None):
        query = self.entity_manager.query(
            LabelDbo.name.label('label'),
            func.sum(TransactionDbo.amount).label('value')
        ).join(
            LabelDbo.transactions
        )
        query = self.filter_by_accounts(query, account_ids)
        query = self.filter_by_date_from(query, date_from)
        query = self.filter_by_date_to(query, date_to)
        query = self.filter_by_sign(query, sign)
        query = query.group_by(LabelDbo.id)
        return query.all()

    def get_grouped_by_period(self, account_ids=None, date_from=None, date_to=None, period=None):
        query = self.entity_manager.query(
            TransactionDbo.date_value.label('label'),
            func.sum(TransactionDbo.amount).label('value')
        )
        query = self.filter_by_accounts(query, account_ids)
        query = self.filter_by_date_from(query, date_from)
        query = self.filter_by_date_to(query, date_to)
        if period in ['year', 'month', 'day']:
            query = query.group_by(extract('year', TransactionDbo.date_value))
        if period in ['month', 'day']:
            query = query.group_by(extract('month', TransactionDbo.date_value))
        if period in ['day']:
            query = query.group_by(extract('day', TransactionDbo.date_value))
        return query.all()

    def get_total(self, account_ids=None, date_from=None, date_to=None, sign=None):
        query = self.entity_manager.query(
            func.sum(TransactionDbo.amount).label("total")
        )
        query = self.filter_by_accounts(query, account_ids)
        query = self.filter_by_date_from(query, date_from)
        query = self.filter_by_date_to(query, date_to)
        query = self.filter_by_sign(query, sign)
        return query.scalar()

    def create_all(self, transactions):
        for transaction in transactions:
            self.entity_manager.get_session().add(transaction)
        try:
            self.entity_manager.get_session().commit()
        except:
            self.entity_manager.get_session().rollback()
            raise
        return True

    @staticmethod
    def filter_by_accounts(query, account_ids=None):
        if account_ids is not None:
            query = query.filter(TransactionDbo.account_id.in_(account_ids))
        return query

    @staticmethod
    def filter_by_date_from(query, date_from=None):
        if date_from is not None:
            query = query.filter(
                TransactionDbo.date_value >= date_from
            )
        return query

    @staticmethod
    def filter_by_date_to(query, date_to=None):
        if date_to is not None:
            query = query.filter(
                TransactionDbo.date_value < date_to
            )
        return query

    @staticmethod
    def filter_by_labels(query, label_ids=None):
        if label_ids is not None:
            query = query.filter(TransactionDbo.label_id.in_(label_ids))
        return query

    @staticmethod
    def filter_by_sign(query, sign=None):
        if sign is False:
            query = query.filter(
                TransactionDbo.amount < 0
            )
        if sign is True:
            query = query.filter(
                TransactionDbo.amount >= 0
            )
        return query
