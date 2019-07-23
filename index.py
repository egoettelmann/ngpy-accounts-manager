import logging
import os

from flask import Flask, request, session
from flask_cors import CORS

from backend.controllers.account import AccountController
from backend.controllers.category import CategoryController
from backend.controllers.label import LabelController
from backend.controllers.session import SessionController
from backend.controllers.statistics import StatisticsController
from backend.controllers.transaction import TransactionController
from backend.dbconnector.manager import EntityManager
from backend.domain.exceptions import ApplicationExceptionHandler, NotAuthenticatedException
from backend.modules.depynject import Depynject
from backend.modules.di_providers import RequestDiProvider
from backend.modules.restipy import Api

logging.basicConfig(format='%(asctime)s - %(thread)d - %(levelname)s - %(name)s - %(message)s', level=logging.DEBUG)

rdi_provider = RequestDiProvider()
d_injector = Depynject(providers={
    'request': rdi_provider.provide
})
e_handler = ApplicationExceptionHandler()

app = Flask(__name__,
            static_folder='frontend/dist',
            static_url_path=''
            )
CORS(app, origins='http://localhost:4210', supports_credentials=True)
api = Api(app,
          prefix='/rest',
          di_provider=d_injector.provide,
          exception_handler=e_handler
          )

app.secret_key = os.environ['SESSION_SECRET_KEY']
em = EntityManager(os.environ['DATABASE_URL'])
d_injector.register_singleton(em)


@app.route('/')
def serve_app():
    logging.info('Loading index page')
    return app.send_static_file('index.html')


@app.before_request
def before_request():
    if request.method != 'OPTIONS' \
            and request.path.startswith(api.prefix) \
            and not request.endpoint.startswith('SessionController'):
        if 'logged_user_id' not in session:
            logging.warning('User is not authenticated')
            return api.return_exception(NotAuthenticatedException('Not authenticated'))
        else:
            logging.debug('Request from user %s', session['logged_user_id'])


@app.teardown_request
def teardown_request(exception):
    rdi_provider.clear()
    if exception is not None:
        logging.critical('App teardown due to exception %s', exception)


api.register(AccountController)
api.register(LabelController)
api.register(CategoryController)
api.register(TransactionController)
api.register(StatisticsController)
api.register(SessionController)

if __name__ == '__main__':
    app.run(debug=True, port=5050, threaded=True)
