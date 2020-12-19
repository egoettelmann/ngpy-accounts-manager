import logging
import os
import sys

sys.path.append('./site-packages')

from flask import request, session
from flask_cors import CORS

from app.modules.depynject import Depynject
from app.modules.di_providers import RequestDiProvider

from app.controllers import *
from app.domain.exceptions import ApplicationExceptionHandler, NotAuthenticatedException

from app.main import app, entity_manager, app_properties
from app.modules.restipy import Api

# Configuring Dependency Injection
rdi_provider = RequestDiProvider()
depynject_container = Depynject(providers={
    'request': rdi_provider.provide
})
depynject_container.register_singleton(entity_manager)
depynject_container.register_singleton(app_properties)

# Adding secret jey for encrypting cookies
app.secret_key = app_properties.session_secret_key

# Configuring CORS
CORS(app, origins=app_properties.cors_origin, supports_credentials=True)

# Building the api (the Restful app)
api = Api(app,
          prefix='/rest',
          di_provider=depynject_container.provide,
          exception_handler=ApplicationExceptionHandler()
          )

# Registering the api.controllers
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
    app.run(debug=True, port=5050, threaded=True, host='0.0.0.0')
