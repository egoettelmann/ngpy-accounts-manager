from flask_restful import fields


class Transaction():
    resource_fields = {
        'id': fields.Integer,
        'reference': fields.String,
        'description': fields.String,
        'date_value': fields.DateTime(dt_format="iso8601"),
        'amount': fields.Float,
    }

    def __init__(self, id=None, account_id=None, date_compta=None, date_operation=None, description=None, reference=None, date_value=None, amount=None, note=None, label_id=None, hash=None):
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

    def __repr__(self):
        return '<Transaction %r>' % self.reference
