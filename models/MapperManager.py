from models.Mapper import Mapper
from models.domain.Account import Account
from models.domain.Label import Label
from models.domain.Transaction import Transaction
from models.entities.AccountDbo import AccountDbo
from models.entities.LabelDbo import LabelDbo
from models.entities.TransactionDbo import TransactionDbo


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
