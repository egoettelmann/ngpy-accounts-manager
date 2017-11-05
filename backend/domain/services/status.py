from ...modules.depynject import injectable

from ..models import Status


@injectable()
class StatusService():

    def __init__(self, status_repository, object_mapper):
        self.repository = status_repository
        self.mapper = object_mapper

    def get_all(self):
        return self.mapper.map_all(
            self.repository.get_all(),
            Status
        )

    def get_by_id(self, status_id):
        return self.mapper.map(
            self.repository.get_by_id(status_id),
            Status
        )

    def get_last_account_status(self, account_id, date=None):
        last_status = self.repository.get_last_account_status(account_id, date)
        if last_status is None:
            return None
        print('get_last_account_status', last_status)
        return self.mapper.map(
            last_status,
            Status
        )
