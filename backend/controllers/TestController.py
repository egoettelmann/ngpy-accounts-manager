from .. import restful


@restful.prefix("/test")
class TestController():

    @restful.route("/<val>")
    def get_one(self, val=None):
        return {'test': val}
