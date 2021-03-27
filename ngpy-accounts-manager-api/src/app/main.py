import logging
import os

from flask import Flask

from .config import AppProperties
from .dbconnector import EntityManager

# Configuring Logging
logging.basicConfig(format='%(asctime)s - %(thread)d - %(levelname)s - %(name)s - %(message)s', level=logging.DEBUG)

# Loading app_properties
ROOT_PATH = os.getenv('LAMBDA_TASK_ROOT', '.')
version_file = ROOT_PATH + '/assets/version.txt'
app_properties = AppProperties(
    database_url=os.getenv('DATABASE_URI', 'sqlite:///database.db'),
    session_secret_key=os.getenv('SESSION_SECRET_KEY'),
    cors_origin=os.getenv('CORS_ORIGIN'),
    app_version=open(version_file).read().rstrip()
)

# Configuring Database
entity_manager = EntityManager(app_properties.database_url)

# Instantiating the App
app = Flask(__name__)
