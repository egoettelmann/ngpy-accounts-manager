from flask import Flask, request, session, abort
from flask_restful import Api

from .models.DBManager import DBManager


app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
app.config.from_pyfile('../config.cfg')
api = Api(app, prefix="/rest")
DBManager.init(app.config['DATASOURCE'])

from .controllers import session
from .controllers import statistics
from .controllers import account
from .controllers import label
from .controllers import transaction


@app.route("/")
def serve_page():
    return app.send_static_file("index.html")


api.add_resource(session.Authentication, '/login', endpoint='login')
api.add_resource(statistics.Repartition, '/stats/repartition')
api.add_resource(statistics.Treasury, '/stats/treasury')
api.add_resource(statistics.AccountSummary, '/stats/summary')
api.add_resource(label.Details, '/labels', '/labels/<int:label_id>', endpoint='labels')
api.add_resource(account.Details, '/accounts', '/accounts/<int:account_id>', endpoint='accounts')
api.add_resource(transaction.Details, '/transactions', '/transactions/<int:transaction_id>', endpoint='transactions')


@app.before_request
def before_request():
    if request.path.startswith(api.prefix) and request.endpoint != 'login':
        if 'logged_user_id' not in session:
            abort(403)
        else:
            print('user ' + str(session['logged_user_id']))


def run():
    app.run(debug=True, port=5050)