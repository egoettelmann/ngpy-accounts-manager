from datetime import date
from typing import List, Optional

from ..models import Status
from ...dbconnector.repositories import StatusRepository
from ...mapping import Mapper
from ...modules.depynject import injectable


@injectable()
class StatusService:
    """
    The status service class that defines all business operations.
    """

    def __init__(self,
                 status_repository: StatusRepository,
                 object_mapper: Mapper
                 ) -> None:
        """Constructor

        :param status_repository: the status repository
        :param object_mapper: the object mapper
        """
        self.__repository = status_repository
        self.__mapper = object_mapper

    def get_all(self) -> List[Status]:
        """Gets the list of all status.

        :return: the list of all status
        """
        return self.__mapper.map_all(
            self.__repository.get_all(),
            Status
        )

    def get_by_id(self, status_id: int) -> Status:
        """Gets a status by its id.

        :param status_id: the status id
        :return:
        """
        return self.__mapper.map(
            self.__repository.get_by_id(status_id),
            Status
        )

    def get_last_account_status(self, account_id: int, value_date: date = None) -> Optional[Status]:
        """Gets the last status of an account before a given date.

        :param account_id: the account id
        :param value_date: the latest allowed date for the status to search
        :return: the status
        """
        last_status = self.__repository.get_last_account_status(account_id, value_date)
        if last_status is None:
            return None
        return self.__mapper.map(
            last_status,
            Status
        )
