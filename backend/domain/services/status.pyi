import datetime

from ...mapping import Mapper
from ...dbconnector.repositories.status import StatusRepository

from ..models import Status


class StatusService():
    repository : StatusRepository
    mapper : Mapper

    def __init__(self, status_repository : StatusRepository, object_mapper : Mapper) -> None: ...

    def get_all(self) -> list(Status) : ...

    def get_by_id(self, status_id : int) -> Status : ...

    def get_last_account_status(self, account_id : int, date : datetime.date) -> Status: ...
