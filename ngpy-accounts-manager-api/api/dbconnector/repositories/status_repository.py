from datetime import date
from typing import List

from sqlalchemy.sql.expression import desc

from ..entities import StatusDbo
from ..manager import EntityManager
from ...modules.depynject import injectable


@injectable()
class StatusRepository:
    """
    The status repository class that handles all database operations.
    """

    def __init__(self, entity_manager: EntityManager):
        """Constructor

        :param entity_manager: the entity manager
        """
        self.__entity_manager = entity_manager

    def get_all(self) -> List[StatusDbo]:
        """Gets all status

        :return: the list of all status
        """
        return self.__entity_manager.query(StatusDbo).all()

    def get_by_id(self, status_id: int) -> StatusDbo:
        """Gets a status by a given id.

        :param status_id: the status id
        :return: the status
        """
        return self.__entity_manager.query(StatusDbo).get(status_id)

    def get_last_account_status(self, account_id: int, end_date: date = None) -> StatusDbo:
        """Gets the last defined status of a given account at a given date.

        :param account_id: the account id
        :param end_date: the latest allowed date for the status to search
        :return: the status
        """
        status = self.__entity_manager.query(StatusDbo).filter(StatusDbo.account_id == account_id)
        status = status.order_by(desc(StatusDbo.date))
        if end_date is not None:
            status = status.filter(StatusDbo.date < end_date)
        return status.first()
