from models.Mapper import Mapper
from models.domain.Account import Account
from models.domain.Label import Label
from models.entities.AccountDbo import AccountDbo
from models.entities.LabelDbo import LabelDbo


class MapperManager():
    _mapper = None

    @staticmethod
    def init():
        MapperManager._mapper = Mapper()
        MapperManager._mapper.create_map(LabelDbo, Label)
        MapperManager._mapper.create_map(AccountDbo, Account)

    @staticmethod
    def getInstance():
        if MapperManager._mapper is None:
            MapperManager.init()
        return MapperManager._mapper
