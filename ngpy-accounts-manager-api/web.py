import logging
import os

from flask import Flask, request, session
from flask_cors import CORS

from api.controllers import *
from api.dbconnector.manager import EntityManager
from api.domain.exceptions import ApplicationExceptionHandler, NotAuthenticatedException
from api.modules.depynject import Depynject
from api.modules.di_providers import RequestDiProvider
from api.modules.restipy import Api

######################
# Configuring Logging
######################
logging.basicConfig(format='%(asctime)s - %(thread)d - %(levelname)s - %(name)s - %(message)s', level=logging.DEBUG)

###################################
# Configuring Dependency Injection
###################################
rdi_provider = RequestDiProvider()
d_injector = Depynject(providers={
    'request': rdi_provider.provide
})

# Configuring Entity Manager
database_connection_url = os.environ.get('DATABASE_URL', 'sqlite:///database.db')
em = EntityManager(database_connection_url)
d_injector.register_singleton(em)

# Registering the App Properties
app_properties = {}
version_file_path = os.path.join(os.path.dirname(__file__), 'version.txt')
with open(version_file_path, 'r') as version_file:
    app_properties['version'] = version_file.read()
d_injector.register_singleton(app_properties, 'app_properties')

###################
# Building the App
###################
static_folder_path = os.path.join(os.path.dirname(__file__), '../ngpy-accounts-manager-ui/dist')
app = Flask(__name__,
            static_folder=static_folder_path,
            static_url_path=''
            )
app.secret_key = os.environ['SESSION_SECRET_KEY']

# Configuring CORS
CORS(app, origins='http://localhost:4210', supports_credentials=True)

# Building the api (the Restful app)
api = Api(app,
          prefix='/rest',
          di_provider=d_injector.provide,
          exception_handler=ApplicationExceptionHandler()
          )

# Registering the controllers
api.register(AccountController)
api.register(BudgetController)
api.register(LabelController)
api.register(CategoryController)
api.register(TransactionController)
api.register(StatisticsController)
api.register(SessionController)


##############################
# Index Page for starting app
##############################
@app.route('/')
def serve_app():
    logging.info('Loading index page')
    return app.send_static_file('index.html')


########################
# Authentication filter
########################
@app.before_request
def before_request():
    logging.info('REQUESTING %s %s', request.path, request.endpoint)
    if request.method != 'OPTIONS' \
            and request.path.startswith(api.prefix) \
            and not request.endpoint.startswith('SessionController'):
        if 'logged_user_id' not in session:
            logging.warning('User is not authenticated')
            return api.return_exception(NotAuthenticatedException('Not authenticated'))
        else:
            logging.debug('Request from user %s', session['logged_user_id'])


######################
# Post request filter
######################
@app.teardown_request
def teardown_request(exception):
    rdi_provider.clear()
    if exception is not None:
        logging.critical('App teardown due to exception %s', exception)


######################
# Starting the WebApp
######################
if __name__ == '__main__':
    app.run(debug=True, port=5050, threaded=True)
