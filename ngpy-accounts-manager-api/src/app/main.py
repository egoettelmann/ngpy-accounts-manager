import logging
import os

from flask import Flask

from .dbconnector import EntityManager

# Configuring Logging
logging.basicConfig(format='%(asctime)s - %(thread)d - %(levelname)s - %(name)s - %(message)s', level=logging.DEBUG)

# Configuring Database
database_connection_url = os.environ.get('DATABASE_URI', 'sqlite:///database.db')
entity_manager = EntityManager(database_connection_url)

# Registering the App Properties
app_properties = {}
#version_file_path = os.path.join(os.path.dirname(__file__), '../../version.txt')
#with open(version_file_path, 'r') as version_file:
#    app_properties['version'] = version_file.read()

# Instantiating the App
app = Flask(__name__)
