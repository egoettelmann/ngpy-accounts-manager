from flask import request, session, abort
from flask_restful import Resource

from ..services.AccountService import AccountService


class SessionController(Resource):
    service = AccountService()

    def post(self):
        username = request.json.get('username')
        password = request.json.get('password')
        if username != "admin":
            abort(403)
        session['logged_user_id'] = username
        print(username + '/' + password)
        return {}

    def delete(self):
        session.pop('logged_user_id', None)
        return {}

    def get(self):
        if 'logged_user_id' in session:
            return {'username': 'Test User', 'userId': session['logged_user_id']}
        else:
            abort(403)