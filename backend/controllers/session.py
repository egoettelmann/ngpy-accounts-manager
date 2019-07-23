import logging

import bcrypt
from flask import request, session

from ..domain.exceptions import NotAuthenticatedException, WrongLoginException
from ..domain.models import User
from ..modules import restipy
from ..modules.depynject import injectable


@injectable()
@restipy.prefix('/session')
class SessionController():

    def __init__(self, user_service):
        self.user_service = user_service

    @restipy.route('/login', methods=['POST'])
    def login(self):
        username = request.json.get('username')
        password = request.json.get('password')
        user = self.user_service.find_by_login(username)
        if user is None or not bcrypt.checkpw(password.encode('utf8'), user.password.encode('utf8')):
            logging.error('Impossible to login, bad credentials')
            raise WrongLoginException("Wrong login or password for user '" + str(username) + "' ")
        session['logged_user_id'] = user.id
        return {}

    @restipy.route('/logout', methods=['DELETE'])
    def logout(self):
        session.pop('logged_user_id', None)
        return {}

    @restipy.route('/user', methods=['GET'])
    @restipy.format_as(User)
    def get_user_info(self):
        if 'logged_user_id' in session:
            return self.user_service.get_user(session['logged_user_id'])
        else:
            logging.error('No current user')
            raise NotAuthenticatedException("No user found in session")
