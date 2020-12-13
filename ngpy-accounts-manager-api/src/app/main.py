import yaml
import logging
import os

from flask import Flask

from .dbconnector import EntityManager

# Configuring Logging
logging.basicConfig(format='%(asctime)s - %(thread)d - %(levelname)s - %(name)s - %(message)s', level=logging.DEBUG)

# Configuring Database
database_connection_url = os.environ.get('DATABASE_URI', 'sqlite:///database.db')
entity_manager = EntityManager(database_connection_url)

# Loading config (app_properties)
ENV_PROFILE = os.getenv('ENV_PROFILE', 'dev')
ROOT_PATH = os.getenv('LAMBDA_TASK_ROOT', '..')
# Loading base config
base_config_file = ROOT_PATH + '/assets/config/config.yml'
base_content = open(base_config_file).read()
base_config = yaml.full_load(base_content)
# Loading custom config
custom_config = {}
custom_config_file = ROOT_PATH + '/assets/config/config-' + ENV_PROFILE + '.yml'
if os.path.exists(custom_config_file):
    custom_content = open(custom_config_file).read()
    custom_config = yaml.full_load(custom_content)
app_properties = {**base_config, **custom_config}

# Instantiating the App
app = Flask(__name__)
