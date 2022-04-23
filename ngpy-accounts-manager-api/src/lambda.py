import logging
import sys

logging.info('Adding site-packages to Python path')
sys.path.append('./site-packages')

logging.info('Importing AWSGI')
import awsgi

from app.modules.depynject import Depynject
from app.modules.di_providers import RequestDiProvider

logging.info('Importing create_app')
from app.main import create_app

# Configuring Dependency Injection (adding request scope)
logging.info('Configuring Dependency Injection')
rdi_provider = RequestDiProvider()
depynject_container = Depynject(providers={
    'request': rdi_provider.provide
})

# Building the App
logging.info('Building the App')
app = create_app(depynject_container=depynject_container)

# Defining Lambda handler
logging.info('Defining handler')
def handler(event, context):
    """
    Handler for Lambda function
    :param event:
    :param context:
    :return:
    """
    logging.info('Executing AWSGI')
    result = awsgi.response(app, event, context)
    logging.info('AWSGI executed')
    # Mapping the statusCode to 'int' type for 'elthrasher/http-lambda-invoker'
    result['statusCode'] = int(result['statusCode'])
    return result
