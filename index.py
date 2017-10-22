from flask import Flask
from flask_restful import Api

from controllers.AccountController import AccountController
from controllers.LabelController import LabelController
from controllers.TransactionController import TransactionController
from models.DBManager import DBManager

app = Flask(__name__, static_folder="public", static_url_path="")
api = Api(app, prefix="/rest")


@app.route("/")
def serve_page():
    return app.send_static_file("index.html")


api.add_resource(LabelController, '/labels', '/labels/<int:label_id>')
api.add_resource(AccountController, '/accounts', '/accounts/<int:account_id>')
api.add_resource(TransactionController, '/transactions', '/transactions/<int:transaction_id>')

if __name__ == '__main__':
    DBManager.init()
    app.run(debug=True)