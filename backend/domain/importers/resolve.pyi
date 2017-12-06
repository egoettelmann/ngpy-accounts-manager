from ..models import Transaction


def nth(iterable : list,
        n : int,
        default : any = None) -> any : ...


class Resolver:
    def resolve(self, filename : str) -> ParserInterface : ...


class ParserInterface:
    filename : str

    def __init__(self, filename : str) -> None : ...

    def parse(self) -> list(Transaction) : ...

    def get_account_name(self) -> str : ...

    def create_transaction(self, row : list) -> Transaction : ...
