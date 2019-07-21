from sqlalchemy import cast, Integer
from sqlalchemy.sql.expression import extract, func, desc, label, or_

from ..entities import LabelDbo, TransactionDbo, CategoryDbo
from ...modules.depynject import injectable


@injectable()
class TransactionRepository():

    def __init__(self, entity_manager):
        self.entity_manager = entity_manager

    def get_all(self, account_ids=None, date_from=None, date_to=None, label_ids=None, description=None):
        query = self.entity_manager.query(TransactionDbo)
        query = self.filter_by_accounts(query, account_ids)
        query = self.filter_by_date_from(query, date_from)
        query = self.filter_by_date_to(query, date_to)
        query = self.filter_by_labels(query, label_ids)
        query = self.filter_by_description(query, description)
        return query.order_by(TransactionDbo.date_value).order_by(TransactionDbo.id).limit(500)

    def get_by_id(self, transaction_id):
        return self.entity_manager.query(TransactionDbo).get(transaction_id)

    def count(self, label_id=None):
        query = self.entity_manager.query(TransactionDbo)
        query = self.filter_by_labels(query, None if label_id is None else [label_id])
        return query.count()

    def delete_by_id(self, transaction_id):
        self.entity_manager.query(TransactionDbo).filter(TransactionDbo.id == transaction_id).delete()
        try:
            self.entity_manager.get_session().commit()
        except:
            self.entity_manager.get_session().rollback()
            raise

    def get_last_transaction(self, account_ids):
        query = self.entity_manager.query(TransactionDbo)
        query = self.filter_by_accounts(query, account_ids)
        return query.order_by(desc(TransactionDbo.date_value)).first()

    def get_top_transactions(self, num_transactions, ascending, account_ids=None, date_from=None, date_to=None):
        query = self.entity_manager.query(TransactionDbo)
        query = self.filter_by_accounts(query, account_ids)
        query = self.filter_by_date_from(query, date_from)
        query = self.filter_by_date_to(query, date_to)
        if ascending:
            query = query.order_by(TransactionDbo.amount)
        else:
            query = query.order_by(desc(TransactionDbo.amount))
        return query.limit(num_transactions).all()

    def get_grouped_by_labels(self, account_ids=None, date_from=None, date_to=None, sign=None):
        query = self.entity_manager.query(
            label('key', LabelDbo.name),
            func.sum(TransactionDbo.amount).label('value')
        ).join(
            LabelDbo.transactions
        )
        query = self.filter_by_accounts(query, account_ids)
        query = self.filter_by_date_from(query, date_from)
        query = self.filter_by_date_to(query, date_to)
        query = self.filter_by_sign(query, sign)
        query = query.group_by(LabelDbo.id)
        query = query.group_by(LabelDbo.name)
        return query.all()

    def get_grouped_by_period(self, account_ids=None, date_from=None, date_to=None, period=None):
        query = self.entity_manager.query(
            func.max(TransactionDbo.date_value).label('key'),
            func.sum(TransactionDbo.amount).label('value')
        )
        query = self.filter_by_accounts(query, account_ids)
        query = self.filter_by_date_from(query, date_from)
        query = self.filter_by_date_to(query, date_to)
        if period in ['day']:
            query = query.group_by(extract('day', TransactionDbo.date_value))
            query = query.order_by(extract('day', TransactionDbo.date_value))
        if period in ['month', 'day']:
            query = query.group_by(extract('month', TransactionDbo.date_value))
            query = query.order_by(extract('month', TransactionDbo.date_value))
        if period in ['year', 'month', 'day']:
            query = query.group_by(extract('year', TransactionDbo.date_value))
            query = query.order_by(extract('year', TransactionDbo.date_value))
        return query.all()

    def get_grouped_by_category_type(self, account_ids=None, date_from=None, date_to=None, category_type=None, quarterly=True):
        if quarterly:
            quarter_expr = cast((extract('month', TransactionDbo.date_value) + 2) / 3, Integer)
        else:
            quarter_expr = extract('month', TransactionDbo.date_value)
        query = self.entity_manager.query(
            label('key_one', quarter_expr),
            label('key_two', CategoryDbo.name),
            label('value', func.sum(TransactionDbo.amount))
        ).join(
            CategoryDbo.labels
        ).join(
            LabelDbo.transactions
        )
        query = self.filter_by_accounts(query, account_ids)
        query = self.filter_by_date_from(query, date_from)
        query = self.filter_by_date_to(query, date_to)
        query = self.filter_by_category_type(query, category_type)
        query = query.group_by(CategoryDbo.name)
        query = query.group_by(quarter_expr)
        return query.all()

    def get_grouped_by_labels_and_category_type(self, account_ids=None, date_from=None, date_to=None, category_type=None):
        query = self.entity_manager.query(
            label('key_one', CategoryDbo.name),
            label('key_two', LabelDbo.name),
            label('value', func.sum(TransactionDbo.amount))
        ).join(
            CategoryDbo.labels
        ).join(
            LabelDbo.transactions
        )
        query = self.filter_by_accounts(query, account_ids)
        query = self.filter_by_date_from(query, date_from)
        query = self.filter_by_date_to(query, date_to)
        query = self.filter_by_category_type(query, category_type)
        query = query.group_by(LabelDbo.id)
        query = query.group_by(CategoryDbo.name)
        return query.all()

    def get_total(self, account_ids=None, date_from=None, date_to=None, sign=None):
        query = self.entity_manager.query(
            label('total', func.sum(TransactionDbo.amount))
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

    def save_one(self, transaction):
        self.entity_manager.get_session().merge(transaction)
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
            if None in label_ids:
                query = query.filter(or_(
                    TransactionDbo.label_id.is_(None),
                    TransactionDbo.label_id.in_(label_ids)
                ))
            else:
                query = query.filter(TransactionDbo.label_id.in_(label_ids))
        return query

    @staticmethod
    def filter_by_description(query, description=None):
        if description is not None:
            query = query.filter(TransactionDbo.description.ilike('%' + description + '%'))
        return query

    @staticmethod
    def filter_by_category_type(query, category_type=None):
        if category_type is not None:
            query = query.filter(CategoryDbo.type == category_type)
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
