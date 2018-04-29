from ..models import User
from ...modules.depynject import injectable


@injectable()
class UserService():

    def __init__(self, user_repository, object_mapper):
        self.repository = user_repository
        self.mapper = object_mapper

    def get_all_users(self):
        return self.mapper.map_all(
            self.repository.get_all(),
            User
        )

    def get_user(self, user_id):
        return self.mapper.map(
            self.repository.get_by_id(user_id),
            User
        )

    def find_by_login(self, login):
        user = self.repository.find_by_login(login)
        if user is None:
            return None
        return self.mapper.map(
            user,
            User
        )
