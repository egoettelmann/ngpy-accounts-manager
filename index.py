from flask import Flask
from flask_restful import Resource, Api

from controllers.AccountController import AccountController
from controllers.LabelController import LabelController
from controllers.TransactionController import TransactionController
from models.DBManager import DBManager

app = Flask(__name__)
api = Api(app)

class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}

api.add_resource(HelloWorld, '/')
api.add_resource(LabelController, '/labels', '/labels/<int:label_id>')
api.add_resource(AccountController, '/accounts', '/accounts/<int:account_id>')
api.add_resource(TransactionController, '/transactions')

if __name__ == '__main__':
    DBManager.init()
    app.run(debug=True)