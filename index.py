from flask import Flask
from flask_restful import Api

from backend.models.DBManager import DBManager


app = Flask(__name__, static_folder="public", static_url_path="")
api = Api(app, prefix="/rest")
DBManager.init('sqlite:///compta.db')


from backend.controllers.AccountController import AccountController
from backend.controllers.LabelController import LabelController
from backend.controllers.TransactionController import TransactionController


@app.route("/")
def serve_page():
    return app.send_static_file("index.html")


api.add_resource(LabelController, '/labels', '/labels/<int:label_id>')
api.add_resource(AccountController, '/accounts', '/accounts/<int:account_id>')
api.add_resource(TransactionController, '/transactions', '/transactions/<int:transaction_id>')

if __name__ == '__main__':
    app.run(debug=True)