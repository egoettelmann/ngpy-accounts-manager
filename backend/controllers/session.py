from flask import request, session

from ..domain.exceptions import NotAuthenticatedException, WrongLoginException
from ..modules import restful
from ..modules.depynject import injectable


@injectable()
@restful.prefix('/session')
class SessionController():

    @restful.route('/login', methods=['POST'])
    def login(self):
        username = request.json.get('username')
        password = request.json.get('password')
        if username != "admin":
            raise WrongLoginException("Wrong login '" + str(username) + "' ")
        session['logged_user_id'] = username
        print(username + '/' + password + ': ' + str(session))
        return {}

    @restful.route('/logout', methods=['DELETE'])
    def logout(self):
        session.pop('logged_user_id', None)
        return {}

    @restful.route('/user', methods=['GET'])
    def get_user_info(self):
        if 'logged_user_id' in session:
            return {'username': 'Test User', 'userId': session['logged_user_id']}
        else:
            raise NotAuthenticatedException("No user found in session")
