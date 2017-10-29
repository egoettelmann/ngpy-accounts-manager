from flask_restful import fields


class KeyValue():
    resource_fields = {
        'label': fields.String,
        'value': fields.Float
    }

    def __init__(self, label=None, value=None) -> None:
        self.label = label
        self.value = value

    def __repr__(self):
        return '<KeyValue %r>' % self.label