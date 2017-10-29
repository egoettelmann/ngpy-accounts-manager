from flask import Flask, request, session, abort
from flask_restful import Api

from .models.DBManager import DBManager


app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
app.config.from_pyfile('../config.cfg')
api = Api(app, prefix="/rest")
DBManager.init(app.config['DATASOURCE'])

from .controllers import SessionController
from .controllers import StatisticsController
from .controllers import AccountController
from .controllers import LabelController
from .controllers import TransactionController


@app.route("/")
def serve_page():
    return app.send_static_file("index.html")


api.add_resource(SessionController.Authentication, '/login', endpoint='login')
api.add_resource(StatisticsController.Repartition, '/stats/repartition')
api.add_resource(StatisticsController.Treasury, '/stats/treasury')
api.add_resource(StatisticsController.AccountSummary, '/stats/summary')
api.add_resource(LabelController.Details, '/labels', '/labels/<int:label_id>', endpoint='labels')
api.add_resource(AccountController.Details, '/accounts', '/accounts/<int:account_id>', endpoint='accounts')
api.add_resource(TransactionController.Details, '/transactions', '/transactions/<int:transaction_id>', endpoint='transactions')


@app.before_request
def before_request():
    if request.path.startswith(api.prefix) and request.endpoint != 'login':
        if 'logged_user_id' not in session:
            abort(403)
        else:
            print('user ' + str(session['logged_user_id']))


def run():
    app.run(debug=True, port=5050)