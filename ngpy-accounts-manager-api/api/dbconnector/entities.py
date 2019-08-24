from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.sql.sqltypes import Date, Numeric, Integer, String, Boolean

from . import EntityManager


class QKeyValue:
    """
    The result of a (key, value) query.
    """
    key: str
    value: float


class QCompositeKeyValue:
    """
    The result of a (key_one, key_two, value) query.
    """
    key_one: str
    key_two: str
    value: float


class UserDbo(EntityManager.get_base()):
    """
    The User Database Object
    """
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    login = Column(String(50), unique=True)
    password = Column(String(250))

    def __repr__(self):
        return '<UserDbo %r, %r>' % (self.id, self.login)


class AccountDbo(EntityManager.get_base()):
    """
    The Account Database Object
    """
    __tablename__ = 'accounts'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)
    description = Column(String(250))
    transactions = relationship("TransactionDbo", backref="account")
    color = Column(String(50))
    notify = Column(Boolean())
    active = Column(Boolean())
    status = relationship("StatusDbo", backref="account")

    def __init__(self, id=None,  name=None, description=None, color=None, notify=None, active=None):
        self.id = id
        self.name = name
        self.description = description
        self.color = color
        self.notify = notify
        self.active = active

    def __repr__(self):
        return '<AccountDbo %r, %r>' % (self.id, self.name)


class LabelDbo(EntityManager.get_base()):
    """
    The Label Database Object
    """
    __tablename__ = 'labels'
    id = Column(Integer, primary_key=True)
    name = Column(String(250), unique=True)
    color = Column(String(50))
    icon = Column(String(50))
    transactions = relationship("TransactionDbo", backref="label")
    category_id = Column(Integer, ForeignKey('categories.id'))

    def __init__(self, id=None, name=None, color=None, icon=None, category_id=None):
        self.id = id
        self.name = name
        self.color = color
        self.icon = icon
        self.category_id = category_id

    def __repr__(self):
        return '<LabelDbo %r, %r>' % (self.id, self.name)


class CategoryDbo(EntityManager.get_base()):
    """
    The Category Database Object
    """
    __tablename__ = 'categories'
    id = Column(Integer, primary_key=True)
    name = Column(String(250), unique=True)
    type = Column(String(10))
    labels = relationship("LabelDbo", backref="category")

    def __init__(self, id=None, name=None, type=None):
        self.id = id
        self.name = name
        self.type = type

    def __repr__(self):
        return '<CategoryDbo %r, %r>' % (self.id, self.name)


class StatusDbo(EntityManager.get_base()):
    """
    The Status Database Object
    """
    __tablename__ = 'status'
    id = Column(Integer, primary_key=True)
    account_id = Column(Integer, ForeignKey('accounts.id'))
    date = Column(Date())
    value = Column(Numeric(precision=2))

    def __init__(self, account_id, date, value=0):
        self.account_id = account_id
        self.date = date
        self.value = value

    def __repr__(self):
        return '<StatusDbo %r, %r>' % (self.id, self.date)


class TransactionDbo(EntityManager.get_base()):
    """
    The Transaction Database Object
    """
    __tablename__ = 'transactions'
    id = Column(Integer, primary_key=True)
    account_id = Column(Integer, ForeignKey('accounts.id'))
    date_compta = Column(Date())
    date_operation = Column(Date())
    date_value = Column(Date())
    description = Column(String(250))
    reference = Column(String(50))
    amount = Column(Numeric(precision=2))
    note = Column(String(250))
    label_id = Column(Integer, ForeignKey('labels.id'))
    hash = Column(String(250), unique=True)

    def __init__(self, id=None, account_id=None, date_compta=None, date_operation=None, description=None,
                 reference=None, date_value=None, amount=None, note=None, label_id=None, hash=None):
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
        return '<TransactionDbo %r, %r>' % (self.id, self.reference)
