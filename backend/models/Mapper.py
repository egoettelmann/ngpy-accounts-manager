from mapper.object_mapper import ObjectMapper

from ..depynject import injectable
from ..dbconnector.entities import LabelDbo, AccountDbo, TransactionDbo
from .domain.Account import Account
from .domain.Label import Label
from .domain.Transaction import Transaction


@injectable('object_mapper')
class Mapper(ObjectMapper):

    def __init__(self):
        super(Mapper, self).__init__()
        self.create_map(LabelDbo, Label)
        self.create_map(AccountDbo, Account)
        self.create_map(TransactionDbo, Transaction)

    def map_all(self, object_list, target_type):
        target_list = []
        for obj in object_list:
            target_list.append(self.map(obj, target_type))
        return target_list
