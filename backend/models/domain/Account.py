from flask_restful import fields


class Account():
    resource_fields = {
        'id': fields.Integer,
        'name': fields.String,
        'description': fields.String,
        'total': fields.Float,
        'color': fields.String,
    }

    def __init__(self, id=None, name=None, description=None, total=None, color=None):
        self.id = id
        self.name = name
        self.description = description
        self.total = total
        self.color = color
