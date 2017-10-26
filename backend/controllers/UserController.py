from flask import request, session, abort
from flask_restful import Resource

from ..services.AccountService import AccountService


class UserController(Resource):
    service = AccountService()

    def get(self):
        if 'logged_user_id' in session:
            return {'username': 'Test User', 'userId': session['logged_user_id']}
        else:
            abort(403)
