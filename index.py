from flask import Flask, request, session, abort

from backend.dbconnector.manager import EntityManager
from backend.modules.depynject import Depynject
from backend.modules.restful import Api
from backend.controllers.account import AccountController
from backend.controllers.label import LabelController
from backend.controllers.transaction import TransactionController
from backend.controllers.statistics import StatisticsController
from backend.controllers.session import SessionController

d_injector = Depynject()

app = Flask(__name__, static_folder="frontend/dist", static_url_path="")
api = Api(app, prefix="/rest", di_provider=d_injector.provide)

app.config.from_pyfile('config.cfg')
em = EntityManager(app.config['DATASOURCE'])
d_injector.register_singleton(em)
em.init()


@app.route("/")
def serve_page():
    return app.send_static_file("index.html")


@app.before_request
def before_request():
    if request.path.startswith(api.prefix) and not request.endpoint.startswith('SessionController'):
        if 'logged_user_id' not in session:
            abort(403)
        else:
            print('user ' + str(session['logged_user_id']))


api.register(AccountController)
api.register(LabelController)
api.register(TransactionController)
api.register(StatisticsController)
api.register(SessionController)

if __name__ == '__main__':
    app.run(debug=True, port=5050)