from flask import Flask

from backend.restful import Api
from backend.controllers.TestController import TestController

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
api = Api(app, prefix="/rest")


@api.route("/<val>")
def test_route(val=None):
    print('Test route')
    return {'test': val}


api.register(TestController)

if __name__ == '__main__':
    app.run(debug=True, port=5050)