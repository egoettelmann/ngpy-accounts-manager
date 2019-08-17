from datetime import date
from enum import Enum
from typing import Optional

from ..modules import restipy
from ..modules.restipy import types


class PeriodType(Enum):
    DAY = 'DAY'
    MONTH = 'MONTH'
    QUARTER = 'QUARTER'
    YEAR = 'YEAR'

    @staticmethod
    def resolve(value: str) -> Optional['PeriodType']:
        for name, member in PeriodType.__members__.items():
            if member.value == value:
                return member
        return None


@restipy.convertible({
    'id': types.Integer(),
    'login': types.String(),
})
class User:

    def __init__(self, id: int = None, login: str = None, password: str = None):
        self.id = id
        self.login = login
        self.password = password


@restipy.convertible({
    'id': types.Integer(),
    'name': types.String(),
    'description': types.String(),
    'total': types.Float(ignore_on_parse=True),
    'status': types.String(),
    'color': types.String(),
    'notify': types.Boolean(),
    'active': types.Boolean(),
    'lastUpdate': types.DateTime(attribute='last_update', dt_format='iso8601', ignore_on_parse=True)
})
class Account:

    def __init__(self, id: int = None, name: str = None, description: str = None,
                 total: float = None, status: str = None, color: str = None,
                 notify: bool = None, active: bool = None):
        self.id = id
        self.name = name
        self.description = description
        self.total = total
        self.status = status
        self.color = color
        self.notify = notify
        self.active = active


@restipy.convertible({
    'key': types.String(),
    'value': types.Float()
})
class KeyValue:

    def __init__(self, key: str = None, value: float = None) -> None:
        self.key = key
        self.value = value


@restipy.convertible({
    'keyOne': types.String(attribute='key_one'),
    'keyTwo': types.String(attribute='key_two'),
    'value': types.Float()
})
class CompositeKeyValue:

    def __init__(self, key_one: str = None, key_two: str = None, value: float = None) -> None:
        self.key_one = key_one
        self.key_two = key_two
        self.value = value


@restipy.convertible({
    'id': types.Integer(),
    'name': types.String(),
    'type': types.String(),
    'numLabels': types.Integer(attribute='num_labels', ignore_on_parse=True),
})
class Category:

    def __init__(self, id: int = None, name: str = None, type: str = None, num_labels: int = None) -> None:
        self.id = id
        self.name = name
        self.type = type
        self.num_labels = num_labels


@restipy.convertible({
    'id': types.Integer(),
    'name': types.String(),
    'color': types.String(),
    'icon': types.String(),
    'category_id': types.Integer(),
    'category': types.Nested(Category, ignore_on_parse=True),
    'numTransactions': types.Integer(attribute='num_transactions', ignore_on_parse=True)
})
class Label:

    def __init__(self, id: int = None, name: str = None, color: str = None, icon: str = None,
                 category_id: int = None, category: Category = None, num_transactions: int = None) -> None:
        self.id = id
        self.name = name
        self.color = color
        self.icon = icon
        self.category_id = category_id
        self.category = category
        self.num_transactions = num_transactions

    def __repr__(self):
        return '<Label %r, %r>' % (self.id, self.name)


@restipy.convertible({
    'amountStart': types.Float(attribute='amount_start', ignore_on_parse=True),
    'amountEnd': types.Float(attribute='amount_end', ignore_on_parse=True),
    'totalCredit': types.Float(attribute='total_credit', ignore_on_parse=True),
    'totalDebit': types.Float(attribute='total_debit', ignore_on_parse=True)
})
class Summary:

    def __init__(self, amount_start: float = None, amount_end: float = None,
                 total_credit: float = None, total_debit: float = None
                 ) -> None:
        self.amount_start = amount_start
        self.amount_end = amount_end
        self.total_credit = total_credit
        self.total_debit = total_debit


@restipy.convertible({
    'accountId': types.Integer(attribute='account_id'),
    'date': types.DateTime(dt_format="iso8601"),
    'value': types.Float(),
})
class Status:

    def __init__(self, account_id: int = None, value_date: date = None, value: float = 0):
        self.account_id = account_id
        self.date = value_date
        self.value = value


@restipy.convertible({
    'id': types.Integer(),
    'reference': types.String(),
    'description': types.String(),
    'dateValue': types.DateTime(attribute='date_value', dt_format="iso8601"),
    'amount': types.Float(),
    'label_id': types.Integer(),
    'label': types.Nested(Label, ignore_on_parse=True),
    'account_id': types.Integer(),
    'account': types.Nested(Account, ignore_on_parse=True)
})
class Transaction:

    def __init__(self, id: int = None, account_id: int = None,
                 date_compta: date = None, date_operation: date = None, description: str = None,
                 reference: str = None, date_value: date = None, amount: float = None,
                 note: str = None, label_id: int = None, hash: str = None,
                 label: Label = None, account: Account = None):
        self.id = id
        self.account_id = account_id
        self.date_compta = date_compta
        self.date_operation = date_operation
        self.description = description
        self.reference = reference
        self.date_value = date_value
        self.amount = amount
        self.note = note
        self.label_id = label_id
        self.hash = hash
        self.label = label
        self.account = account

    def __repr__(self):
        return '<Transaction %r, %r>' % (self.reference, self.label)


@restipy.convertible({
    'label': types.String(),
    'level': types.String(),
    'value': types.String()
})
class Notification:

    def __init__(self, label: str = None, level: str = None, value: str = None) -> None:
        self.label = label
        self.level = level
        self.value = value
