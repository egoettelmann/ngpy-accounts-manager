from flask import request, session, abort

from .. import restful
from ..depynject import injectable


@injectable()
@restful.prefix('/session')
class SessionController():

    @restful.route('', methods=['POST'])
    def login(self):
        username = request.json.get('username')
        password = request.json.get('password')
        if username != "admin":
            abort(403)
        session['logged_user_id'] = username
        print(username + '/' + password)
        return {}

    @restful.route('', methods=['DELETE'])
    def logout(self):
        session.pop('logged_user_id', None)
        return {}

    @restful.route('', methods=['GET'])
    def get_user_info(self):
        if 'logged_user_id' in session:
            return {'username': 'Test User', 'userId': session['logged_user_id']}
        else:
            abort(403)