from ...modules.depynject import injectable

from ..entities import UserDbo


@injectable()
class UserRepository():

    def __init__(self, entity_manager):
        self.entity_manager = entity_manager

    def get_all(self):
        return self.entity_manager.query(UserDbo).all()

    def get_by_id(self, user_id):
        return self.entity_manager.query(UserDbo).get(user_id)

    def find_by_login(self, login):
        return self.entity_manager.query(UserDbo).filter(UserDbo.login == login).first()
