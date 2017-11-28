from sqlalchemy.sql.expression import desc

from ...modules.depynject import injectable

from ..entities import StatusDbo


@injectable()
class StatusRepository():

    def __init__(self, entity_manager):
        self.entity_manager = entity_manager

    def get_all(self):
        return self.entity_manager.query(StatusDbo).all()

    def get_by_id(self, status_id):
        return self.entity_manager.query(StatusDbo).get(status_id)

    def get_last_account_status(self, account_id, date=None):
        status = self.entity_manager.query(StatusDbo).filter(StatusDbo.account_id == account_id)
        status = status.order_by(desc(StatusDbo.date))
        if date is not None:
            status = status.filter(StatusDbo.date < date)
        return status.first()
