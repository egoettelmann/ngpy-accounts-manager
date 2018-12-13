from ..modules import restipy
from ..modules.restipy import types


@restipy.convertible({
    'id': types.Integer(),
    'login': types.String(),
})
class User:

    def __init__(self, id=None, login=None, password=None):
        self.id = id
        self.login = login
        self.password = password


@restipy.convertible({
    'id': types.Integer(),
    'name': types.String(),
    'description': types.String(),
    'total': types.Float(ignore_on_parse=True),
    'color': types.String(),
    'lastUpdate': types.DateTime(attribute='last_update', dt_format='iso8601', ignore_on_parse=True)
})
class Account:

    def __init__(self, id=None, name=None, description=None, total=None, color=None):
        self.id = id
        self.name = name
        self.description = description
        self.total = total
        self.color = color


@restipy.convertible({
    'label': types.String(),
    'value': types.Float()
})
class KeyValue:

    def __init__(self, label=None, value=None) -> None:
        self.label = label
        self.value = value


@restipy.convertible({
    'category': types.String(),
    'label': types.String(),
    'value': types.Float()
})
class GroupedValue:

    def __init__(self, category=None, label=None, value=None) -> None:
        self.category = category
        self.label = label
        self.value = value


@restipy.convertible({
    'id': types.Integer(),
    'name': types.String(),
    'type': types.String(),
    'numLabels': types.Integer(attribute='num_labels', ignore_on_parse=True),
})
class Category:

    def __init__(self, id=None, name=None, type=None, num_labels=None) -> None:
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

    def __init__(self, id=None, name=None, color=None, icon=None, category_id=None, category=None,
                 num_transactions=None) -> None:
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
    'totalDebit': types.Float(attribute='total_debit', ignore_on_parse=True),
    'periodType': types.String(attribute='period_type', ignore_on_parse=True)
})
class Summary:

    def __init__(self, amount_start=None, amount_end=None, total_credit=None, total_debit=None,
                 period_type=None) -> None:
        self.amount_start = amount_start
        self.amount_end = amount_end
        self.total_credit = total_credit
        self.total_debit = total_debit
        self.period_type = period_type


@restipy.convertible({
    'accountId': types.Integer(attribute='account_id'),
    'date': types.DateTime(dt_format="iso8601"),
    'value': types.Float(),
})
class Status:

    def __init__(self, account_id=None, date=None, value=0):
        self.account_id = account_id
        self.date = date
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

    def __init__(self, id=None, account_id=None, date_compta=None, date_operation=None, description=None,
                 reference=None, date_value=None, amount=None, note=None, label_id=None, hash=None, label=None,
                 account=None):
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

    def __init__(self, label=None, level=None, value=None) -> None:
        self.label = label
        self.level = level
        self.value = value
