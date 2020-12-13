import logging

import bcrypt
from flask import request, session

from ..domain.exceptions import NotAuthenticatedException, WrongLoginException
from ..domain.models import User
from ..domain.services import UserService
from ..modules import restipy
from ..modules.depynject import injectable


@injectable()
@restipy.prefix('/session')
class SessionController:
    """
    The session controller that handles all user related API requests.
    """

    def __init__(self, user_service: UserService, app_properties: dict):
        """Constructor

        :param user_service: the user service
        :param app_properties: the app properties
        """
        self.__user_service = user_service
        self.__app_properties = app_properties

    @restipy.route('/properties', methods=['GET'])
    def properties(self) -> dict:
        """Gets the app properties

        :return: the app properties
        """
        return self.__app_properties['public']

    @restipy.route('/login', methods=['POST'])
    def login(self) -> dict:
        """Tries to login a user

        :return: empty response that indicates a success
        """
        username = request.json.get('username')
        password = request.json.get('password')
        user = self.__user_service.find_by_login(username)
        if user is None or not bcrypt.checkpw(password.encode('utf8'), user.password.encode('utf8')):
            logging.error('Impossible to login, bad credentials')
            raise WrongLoginException("Wrong login or password for user '" + str(username) + "' ")
        session['logged_user_id'] = user.id
        return {}

    @restipy.route('/logout', methods=['DELETE'])
    def logout(self) -> dict:
        """Logs out the current user.

        :return: empty response that indicates a success
        """
        session.pop('logged_user_id', None)
        return {}

    @restipy.route('/user', methods=['GET'])
    @restipy.format_as(User)
    def get_user_info(self) -> User:
        """Gets the current user info

        :return: the user details
        """
        if 'logged_user_id' not in session:
            logging.error('No current user')
            raise NotAuthenticatedException("No user found in session")
        return self.__user_service.get_user(session['logged_user_id'])
