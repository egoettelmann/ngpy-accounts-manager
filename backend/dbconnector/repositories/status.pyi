import datetime

from sqlalchemy.orm.query import Query

from ..manager import EntityManager
from ..entities import StatusDbo


class StatusRepository():
    query : Query
    entity_manager : EntityManager

    def __init__(self, entity_manager : EntityManager) -> None : ...

    def get_all(self) -> list(StatusDbo) : ...

    def get_by_id(self, status_id : int) -> StatusDbo : ...

    def get_last_account_status(self, account_id : int, date : datetime.date) -> StatusDbo : ...
