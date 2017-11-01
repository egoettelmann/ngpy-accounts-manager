from flask import Flask

from backend.depynject import Depynject
from backend.models.DBManager import DBManager
from backend.restful import Api


app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
api = Api(app, prefix="/rest", di_provider=Depynject().provide)

app.config.from_pyfile('config.cfg')
DBManager.init(app.config['DATASOURCE'])


from backend.controllers.TestController import TestController
from backend.controllers.AccountController import AccountController
from backend.controllers.LabelController import LabelController
from backend.controllers.TransactionController import TransactionController
from backend.services.TestService import TestService
from backend.services.AccountService import AccountService
from backend.services.LabelService import LabelService
from backend.services.StatisticsService import StatisticsService
from backend.services.TransactionService import TransactionService


@api.route("/<val>")
def test_route(val=None):
    print('Test route')
    return {'test': val}


api.register(TestController)
api.register(AccountController)
api.register(LabelController)
api.register(TransactionController)

if __name__ == '__main__':
    app.run(debug=True, port=5050)