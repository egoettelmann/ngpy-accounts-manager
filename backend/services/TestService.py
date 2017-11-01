from ..depynject import injectable


@injectable()
class TestService():

    def get_one(self):
        return 1
