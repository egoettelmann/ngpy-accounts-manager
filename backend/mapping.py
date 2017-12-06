from mapper.object_mapper import ObjectMapper

from .modules.depynject import injectable
from .dbconnector.entities import LabelDbo, AccountDbo, StatusDbo, TransactionDbo
from .domain.models import Account, Label, Status, Transaction


@injectable('object_mapper')
class Mapper(ObjectMapper):

    def __init__(self):
        super(Mapper, self).__init__()
        self.create_map(LabelDbo, Label)
        self.create_map(AccountDbo, Account)
        self.create_map(TransactionDbo, Transaction)
        self.create_map(Transaction, TransactionDbo)
        self.create_map(StatusDbo, Status)

    def map_all(self, object_list, target_type):
        target_list = []
        for obj in object_list:
            target_list.append(self.map(obj, target_type))
        return target_list
