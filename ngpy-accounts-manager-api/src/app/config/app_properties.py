from ..modules import restipy
from ..modules.restipy import types


@restipy.convertible({
    'appVersion': types.String(attribute='app_version')
})
class AppProperties:

    def __init__(self,
                 database_url: str = None,
                 session_secret_key: str = None,
                 cors_origin: str = None,
                 app_version: str = None
                 ):
        self.database_url = database_url
        self.session_secret_key = session_secret_key
        self.cors_origin = cors_origin
        self.app_version = app_version
