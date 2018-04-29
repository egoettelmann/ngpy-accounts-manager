import os

from flask import Flask, request, session
from flask_cors import CORS

from backend.controllers.account import AccountController
from backend.controllers.label import LabelController
from backend.controllers.session import SessionController
from backend.controllers.statistics import StatisticsController
from backend.controllers.transaction import TransactionController
from backend.controllers.category import CategoryController
from backend.dbconnector.manager import EntityManager
from backend.domain.exceptions import ApplicationExceptionHandler, NotAuthenticatedException
from backend.modules.depynject import Depynject
from backend.modules.di_providers import RequestDiProvider
from backend.modules.restful import Api

rdi_provider = RequestDiProvider()
d_injector = Depynject(providers={
    'request': rdi_provider.provide
})
e_handler = ApplicationExceptionHandler()

app = Flask(__name__,
            static_folder="frontend/dist",
            static_url_path=""
            )
CORS(app, origins='http://localhost:4200', supports_credentials=True)
api = Api(app,
          prefix="/rest",
          di_provider=d_injector.provide,
          exception_handler=e_handler
          )

em = EntityManager(os.environ['DATABASE_URL'])
d_injector.register_singleton(em)
em.init()


@app.route("/")
def serve_page():
    return app.send_static_file("index.html")


@app.before_request
def before_request():
    if request.path.startswith(api.prefix) and not request.endpoint.startswith('SessionController'):
        if 'logged_user_id' not in session:
            return api.return_exception(NotAuthenticatedException("Not authenticated"))
        else:
            print('user ' + str(session['logged_user_id']))


@app.after_request
def after_request(resp):
    rdi_provider.clear()
    return resp


api.register(AccountController)
api.register(LabelController)
api.register(CategoryController)
api.register(TransactionController)
api.register(StatisticsController)
api.register(SessionController)

if __name__ == '__main__':
    app.run(debug=True, port=5050, threaded=True)
