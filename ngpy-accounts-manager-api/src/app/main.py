import logging
import os

from flask import Flask, request, session
from flask_cors import CORS

from .config import AppProperties
from .controllers import *
from .dbconnector import EntityManager
from .domain.exceptions import ApplicationExceptionHandler, NotFoundException, NotAuthenticatedException
from .modules.depynject import Depynject
from .modules.restipy import Api


def create_app(app_properties: AppProperties = None,
               depynject_container: Depynject = None):
    # Configuring Logging
    if logging.getLogger().hasHandlers():
        # The Lambda environment pre-configures a handler logging to stderr. If a handler is already configured,
        # `.basicConfig` does not execute. Thus, we set the level directly.
        logging.getLogger().setLevel(logging.INFO)
    else:
        logging.basicConfig(format='%(asctime)s - %(thread)d - %(levelname)s - %(name)s - %(message)s', level=logging.DEBUG)

    # Configuring Dependency Injection
    logging.debug('Configuring dependency injection')
    if depynject_container is None:
        depynject_container = Depynject()

    # Building App properties if required
    logging.debug('Retrieving App properties')
    if app_properties is None:
        app_properties = build_default_app_properties()
    depynject_container.register_singleton(app_properties)

    # Configuring Database
    logging.debug('Registering database')
    entity_manager = EntityManager(app_properties.database_url)
    depynject_container.register_singleton(entity_manager)

    # Instantiating the App
    logging.debug('Instantiating App')
    app = Flask(__name__)

    # Adding secret key for encrypting cookies
    app.secret_key = app_properties.session_secret_key

    # Configuring the API
    logging.debug('Configuring API')
    api = configure_api(app, app_properties.cors_origin, depynject_container)

    # Configuring security
    logging.debug('Configuring security')
    configure_security(api)

    return app


def build_default_app_properties() -> AppProperties:
    # Loading App version
    root_path = os.getenv('LAMBDA_TASK_ROOT', '.')
    version_file = root_path + '/assets/version.txt'
    app_version = open(version_file).read().rstrip()

    # Building app_properties
    return AppProperties(
        database_url=os.getenv('DATABASE_URI', 'sqlite:///database.db'),
        session_secret_key=os.getenv('SESSION_SECRET_KEY'),
        cors_origin=os.getenv('CORS_ORIGIN'),
        app_version=app_version
    )


def configure_api(app: Flask,
                  cors_origin: str,
                  depynject_container: Depynject) -> Api:
    # Configuring CORS
    logging.debug('Enabling CORS for %s', cors_origin)
    CORS(app, origins=cors_origin, supports_credentials=True)

    # Building the Api (the Restful app)
    api = Api(
        app,
        prefix='/rest',
        di_provider=depynject_container.provide,
        exception_handler=ApplicationExceptionHandler()
    )

    # Registering all Api controllers
    api.register(AccountController)
    api.register(BudgetController)
    api.register(LabelController)
    api.register(CategoryController)
    api.register(TransactionController)
    api.register(StatisticsController)
    api.register(SessionController)
    api.register(ConfigController)

    # Defining App error handler
    @app.errorhandler(404)
    def not_found(e):
        logging.warning('Not found: %s', e)
        return api.return_exception(NotFoundException('Not found'))

    return api


def configure_security(api: Api):
    app = api.app

    # Configuring security filter
    @app.before_request
    def before_request():
        logging.debug('%s %s forwarding to %s', request.method, request.path, request.endpoint)
        if is_secured(request):
            if 'logged_user_id' not in session:
                logging.warning('User is not authenticated')
                return api.return_exception(NotAuthenticatedException('Not authenticated'))
            else:
                logging.debug('Request from user %s', session['logged_user_id'])

    def is_secured(req: request) -> bool:
        if req.method == 'OPTIONS':
            return False
        if not req.path.startswith(api.prefix):
            return False
        if req.endpoint.startswith('SessionController'):
            return False
        if req.endpoint.startswith('ConfigController'):
            return False
        return True
