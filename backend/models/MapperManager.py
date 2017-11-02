from ..dbconnector.entities import LabelDbo, AccountDbo, TransactionDbo
from .Mapper import Mapper
from .domain.Account import Account
from .domain.Label import Label
from .domain.Transaction import Transaction


class MapperManager():
    _mapper = None

    @staticmethod
    def init():
        MapperManager._mapper = Mapper()
        MapperManager._mapper.create_map(LabelDbo, Label)
        MapperManager._mapper.create_map(AccountDbo, Account)
        MapperManager._mapper.create_map(TransactionDbo, Transaction)

    @staticmethod
    def getInstance():
        if MapperManager._mapper is None:
            MapperManager.init()
        return MapperManager._mapper
