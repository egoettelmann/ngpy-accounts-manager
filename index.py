from flask import Flask, request, session, abort
from flask_restful import Api

from backend.models.DBManager import DBManager


app = Flask(__name__, static_folder="frontend/dist", static_url_path="")
app.config.from_pyfile('config.cfg')
api = Api(app, prefix="/rest")
DBManager.init(app.config['DATASOURCE'])


from backend.controllers.SessionController import SessionController
from backend.controllers.AccountController import AccountController
from backend.controllers.LabelController import LabelController
from backend.controllers.TransactionController import TransactionController


@app.route("/")
def serve_page():
    return app.send_static_file("index.html")


@app.route("/rest/logout", methods=['GET'])
def logout():
    session.pop('logged_user_id', None)
    return '', 200


api.add_resource(SessionController, '/login', endpoint='login')
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


if __name__ == '__main__':
    app.run(debug=True)