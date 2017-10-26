from flask import request, session
from flask_restful import Resource

from ..services.AccountService import AccountService


class SessionController(Resource):
    service = AccountService()

    def post(self):
        username = request.json.get('username')
        password = request.json.get('password')
        print(username + '/' + password)
        session['logged_user_id'] = username
        return {}

    def delete(self):
        session.pop('logged_user_id', None)
        return {}