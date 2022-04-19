import sys
import awsgi

sys.path.append('./site-packages')

from app.modules.depynject import Depynject
from app.modules.di_providers import RequestDiProvider

from app.main import create_app

# Configuring Dependency Injection (adding request scope)
rdi_provider = RequestDiProvider()
depynject_container = Depynject(providers={
    'request': rdi_provider.provide
})

# Building the App
app = create_app(depynject_container=depynject_container)

# Defining Lambda handler
def handler(event, context):
    """
    Handler for Lambda function
    :param event:
    :param context:
    :return:
    """
    result = awsgi.response(app, event, context)
    # Mapping the statusCode to 'int' type for 'elthrasher/http-lambda-invoker'
    result['statusCode'] = int(result['statusCode'])
    return result
