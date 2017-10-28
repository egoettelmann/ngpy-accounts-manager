from sqlalchemy.sql.expression import extract, func

from ..models.DBManager import DBManager
from ..models.MapperManager import MapperManager
from ..models.domain.KeyValue import KeyValue
from ..models.entities.LabelDbo import LabelDbo
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
        if year is not None:
            entries = entries.filter(
                extract('year', TransactionDbo.date_value) == year
            )
        if month is not None:
            entries = entries.filter(
                extract('month', TransactionDbo.date_value) == month
            )
        if account_ids is not None:
            entries = entries.filter(TransactionDbo.account_id.in_(account_ids))
        entries = entries.group_by(LabelDbo.id)
        for row in entries.all():
            result.append(KeyValue(row.label, row.value))
        return result
