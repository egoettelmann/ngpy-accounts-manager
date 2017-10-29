from flask import Flask, request, session, abort
from flask_restful import Api

from .models.DBManager import DBManager


app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
app.config.from_pyfile('../config.cfg')
api = Api(app, prefix="/rest")
DBManager.init(app.config['DATASOURCE'])

from .controllers.SessionController import SessionController
from .controllers.TreasuryController import TreasuryController
from .controllers.SummaryController import SummaryController
from .controllers.StatisticsController import StatisticsController
from .controllers.AccountController import AccountController
from .controllers.LabelController import LabelController
from .controllers.TransactionController import TransactionController


@app.route("/")
def serve_page():
    return app.send_static_file("index.html")


api.add_resource(SessionController, '/login', endpoint='login')
api.add_resource(TreasuryController, '/treasury')
api.add_resource(SummaryController, '/summary')
api.add_resource(StatisticsController, '/stats')
api.add_resource(LabelController, '/labels', '/labels/<int:label_id>')
api.add_resource(AccountController, '/accounts', '/accounts/<int:account_id>')
api.add_resource(TransactionController, '/transactions', '/transactions/<int:transaction_id>')


@app.before_request
def before_request():
    if request.path.startswith(api.prefix) and request.endpoint != 'login':
        if 'logged_user_id' not in session:
            abort(403)
        else:
            print('user ' + str(session['logged_user_id']))


def run():
    app.run(debug=True, port=5050)