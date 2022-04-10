import logging
import sys

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
