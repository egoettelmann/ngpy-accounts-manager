import hashlib

from flask_restful import fields


class Transaction():
    resource_fields = {
        'reference': fields.String,
        'date': fields.DateTime,
        'amount': fields.Float,
    }

    def __init__(self, account_id=None, date_compta=None, date_operation=None, description=None, reference=None, date_value=None, amount=None, note=None, label_id=None):
        self.account_id = account_id
        self.date_compta = date_compta
        self.date_operation = date_operation
        self.description = description
        self.reference = reference
        self.date_value = date_value
        self.amount = amount
        self.note = note
        self.label_id = label_id
        s = str(account_id) + reference + date_value.strftime("%Y-%m-%d") + "{0:.2f}".format(amount)
        self.hash = hashlib.md5(s.encode('utf-8')).hexdigest()

    def __repr__(self):
        return '<Transaction %r>' % self.reference
