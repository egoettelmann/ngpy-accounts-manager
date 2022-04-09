import sys

sys.path.append('./site-packages')

import awsgi
from web import app


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
