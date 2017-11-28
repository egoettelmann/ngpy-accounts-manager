import random
import string

from flask import Flask, request, session, g
from flask_cors import CORS

from backend.controllers.account import AccountController
from backend.controllers.label import LabelController
from backend.controllers.session import SessionController
from backend.controllers.statistics import StatisticsController
from backend.controllers.transaction import TransactionController
from backend.dbconnector.manager import EntityManager
from backend.domain.exceptions import ApplicationExceptionHandler, NotAuthenticatedException
from backend.modules.depynject import Depynject
from backend.modules.restful import Api


class RequestDiProvider:

    def __init__(self):
        self.di_list = {}

    def provide(self, class_ref, i_args, di_instance):
        id = Depynject.to_camel_case(class_ref.__name__)
        provider_id = self.get_provider_id()

        if provider_id not in self.di_list:
            self.di_list[provider_id] = {}

        if id not in self.di_list[provider_id]:
            self.di_list[provider_id][id] = di_instance.create_new_instance(class_ref, i_args)

        return self.di_list[provider_id][id]

    def clear(self):
        if 'di_provider_id' in g:
            del self.di_list[g.di_provider_id]

    @staticmethod
    def get_provider_id():
        if 'di_provider_id' not in g:
            g.di_provider_id = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(16))
        return g.di_provider_id


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
            return api.return_exception(NotAuthenticatedException("Not authenticated"))
        else:
            print('user ' + str(session['logged_user_id']))


@app.after_request
def after_request(resp):
    rdi_provider.clear()
    return resp


api.register(AccountController)
api.register(LabelController)
api.register(TransactionController)
api.register(StatisticsController)
api.register(SessionController)

if __name__ == '__main__':
    app.run(debug=True, port=5050, threaded=True)
