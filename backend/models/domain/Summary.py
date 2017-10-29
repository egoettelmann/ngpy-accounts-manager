from flask_restful import fields


class Summary():
    resource_fields = {
        'amountStart': fields.Float,
        'amountEnd': fields.Float,
        'totalCredit': fields.Float,
        'totalDebit': fields.Float,
        'periodType': fields.String
    }

    def __init__(self, amountStart=None, amountEnd=None, totalCredit=None, totalDebit=None, periodType=None) -> None:
        self.amountStart = amountStart
        self.amountEnd = amountEnd
        self.totalCredit = totalCredit
        self.totalDebit = totalDebit
        self.periodType = periodType

    def __repr__(self):
        return '<Summary %r>' % self.periodType