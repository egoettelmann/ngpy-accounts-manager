from collections import MutableMapping

from flask_restful import fields


class Patchable(MutableMapping):

    def __getitem__(self, item):
        return getattr(self, item)

    def __setitem__(self, item, value):
        setattr(self, item, value)

    def __iter__(self):
        pass

    def __delitem__(self, key):
        pass

    def __len__(self):
        pass


class User(Patchable):
    resource_fields = {
        'id': fields.Integer,
        'login': fields.String,
    }

    def __init__(self, id=None, login=None, password=None):
        self.id = id
        self.login = login
        self.password = password


class Account(Patchable):
    resource_fields = {
        'id': fields.Integer,
        'name': fields.String,
        'description': fields.String,
        'total': fields.Float,
        'color': fields.String,
        'lastUpdate': fields.DateTime(attribute="last_update", dt_format="iso8601")
    }

    def __init__(self, id=None, name=None, description=None, total=None, color=None):
        self.id = id
        self.name = name
        self.description = description
        self.total = total
        self.color = color


class KeyValue(Patchable):
    resource_fields = {
        'label': fields.String,
        'value': fields.Float
    }

    def __init__(self, label=None, value=None) -> None:
        self.label = label
        self.value = value


class GroupedValue(Patchable):
    resource_fields = {
        'category': fields.String,
        'label': fields.String,
        'value': fields.Float
    }

    def __init__(self, category=None, label=None, value=None) -> None:
        self.category = category
        self.label = label
        self.value = value


class Label(Patchable):
    resource_fields = {
        'id': fields.Integer,
        'name': fields.String,
        'color': fields.String,
        'icon': fields.String,
    }

    def __init__(self, id=None, name=None, color=None, icon=None) -> None:
        self.id = id
        self.name = name
        self.color = color
        self.icon = icon


class Category(Patchable):
    resource_fields = {
        'id': fields.Integer,
        'name': fields.String,
        'type': fields.String,
    }

    def __init__(self, id=None, name=None, type=None) -> None:
        self.id = id
        self.name = name
        self.type = type


class Summary(Patchable):
    resource_fields = {
        'amountStart': fields.Float(attribute='amount_start'),
        'amountEnd': fields.Float(attribute='amount_end'),
        'totalCredit': fields.Float(attribute='total_credit'),
        'totalDebit': fields.Float(attribute='total_debit'),
        'periodType': fields.String(attribute='period_type')
    }

    def __init__(self, amount_start=None, amount_end=None, total_credit=None, total_debit=None, period_type=None) -> None:
        self.amount_start = amount_start
        self.amount_end = amount_end
        self.total_credit = total_credit
        self.total_debit = total_debit
        self.period_type = period_type


class Status(Patchable):
    resource_fields = {
        'accountId': fields.Integer(attribute='account_id'),
        'date': fields.DateTime(dt_format="iso8601"),
        'value': fields.Float,
    }

    def __init__(self, account_id=None, date=None, value=0):
        self.account_id = account_id
        self.date = date
        self.value = value


class Transaction(Patchable):
    resource_fields = {
        'id': fields.Integer,
        'reference': fields.String,
        'description': fields.String,
        'dateValue': fields.DateTime(attribute='date_value', dt_format="iso8601"),
        'amount': fields.Float,
        'label': fields.Nested(Label.resource_fields),
        'account': fields.Nested(Account.resource_fields)
    }

    def __init__(self, id=None, account_id=None, date_compta=None, date_operation=None, description=None, reference=None, date_value=None, amount=None, note=None, label_id=None, hash=None, label=None, account=None):
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
