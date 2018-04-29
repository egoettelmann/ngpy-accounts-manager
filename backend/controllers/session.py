import bcrypt

from flask import request, session
from flask_restful import marshal_with

from ..domain.exceptions import NotAuthenticatedException, WrongLoginException
from ..domain.models import User
from ..modules import restful
from ..modules.depynject import injectable


@injectable()
@restful.prefix('/session')
class SessionController():

    def __init__(self, user_service):
        self.user_service = user_service

    @restful.route('/login', methods=['POST'])
    def login(self):
        username = request.json.get('username')
        password = request.json.get('password')
        user = self.user_service.find_by_login(username)
        if user is None or not bcrypt.checkpw(password.encode('utf8'), user.password.encode('utf8')):
            raise WrongLoginException("Wrong login or password for user '" + str(username) + "' ")
        session['logged_user_id'] = user.id
        return {}

    @restful.route('/logout', methods=['DELETE'])
    def logout(self):
        session.pop('logged_user_id', None)
        return {}

    @restful.route('/user', methods=['GET'])
    @marshal_with(User.resource_fields)
    def get_user_info(self):
        if 'logged_user_id' in session:
            return self.user_service.get_user(session['logged_user_id'])
        else:
            raise NotAuthenticatedException("No user found in session")
