from flask_restful import fields


class Account():
    resource_fields = {
        'id': fields.Integer,
        'name': fields.String,
        'description': fields.String,
        'color': fields.String,
    }

    def __init__(self, name=None, description=None, color=None):
        self.name = name
        self.description = description
        self.color = color
