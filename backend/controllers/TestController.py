from ..depynject import injectable
from .. import restful


@injectable()
@restful.prefix("/test")
class TestController():

    def __init__(self, test_service):
        self.test_service = test_service

    @restful.route("/<val>")
    def get_one(self, val=None):
        return {'test': val}
