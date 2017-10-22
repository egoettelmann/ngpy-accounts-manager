from flask_restful import fields


class Label():
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

    def __repr__(self):
        return '<Label %r>' % self.name