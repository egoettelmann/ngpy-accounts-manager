from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import Column
from sqlalchemy.sql.sqltypes import Integer, String

from models.DBManager import DBManager


class LabelDbo(DBManager.getBase()):
    __tablename__ = 'labels'
    id = Column(Integer, primary_key=True)
    name = Column(String(250), unique=True)
    color = Column(String(50))
    icon = Column(String(50))
    transactions = relationship("Transaction", backref="label")

    def __init__(self, name=None, color=None):
        self.name = name
        self.color = color

    def __repr__(self):
        return '<LabelDbo %r>' % self.name
