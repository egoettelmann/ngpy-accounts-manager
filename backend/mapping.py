from typing import List, Any, TypeVar, Type

from mapper.object_mapper import ObjectMapper

from .modules.depynject import injectable
from .dbconnector.entities import LabelDbo, AccountDbo, StatusDbo, TransactionDbo, CategoryDbo, UserDbo
from .domain.models import Account, Label, Status, Transaction, Category, User


@injectable('object_mapper')
class Mapper(ObjectMapper):
    """
    The object mapper to map domain objects to/from database objects
    """
    T = TypeVar('T')

    def __init__(self):
        """Constructor
        Declares all mappings
        """
        super(Mapper, self).__init__()
        self.create_map(LabelDbo, Label, {'category': lambda x: x.category})
        self.create_map(Label, LabelDbo)
        self.create_map(AccountDbo, Account)
        self.create_map(Account, AccountDbo)
        self.create_map(TransactionDbo, Transaction, {'label': lambda x: x.label, 'account': lambda x: x.account})
        self.create_map(Transaction, TransactionDbo)
        self.create_map(StatusDbo, Status)
        self.create_map(CategoryDbo, Category)
        self.create_map(Category, CategoryDbo)
        self.create_map(UserDbo, User)

    def map_all(self, object_list: List[Any], target_type: Type[T]) -> List[T]:
        """Helper function to map a list of objects

        :param object_list: the source list
        :param target_type: the target type
        :return: the list of mapped objects
        """
        target_list = []
        for obj in object_list:
            target_list.append(self.map(obj, target_type))
        return target_list
