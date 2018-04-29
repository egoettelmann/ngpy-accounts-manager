from ..domain.models import User
from ..domain.services.user import UserService


class SessionController():
    user_service: UserService

    def login(self) -> dict: ...

    def logout(self) -> dict: ...

    def get_user_info(self) -> User: ...
