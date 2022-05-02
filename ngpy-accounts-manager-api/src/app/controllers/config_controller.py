from ..config import AppProperties
from ..domain.services import UserService
from ..modules import restipy
from ..modules.depynject import injectable


@injectable()
@restipy.prefix('/config')
class ConfigController:
    """
    The config controller that provides configuration related endpoints.
    """

    def __init__(self, user_service: UserService, app_properties: AppProperties):
        """Constructor

        :param user_service: the user service
        :param app_properties: the app properties
        """
        self.__user_service = user_service
        self.__app_properties = app_properties

    @restipy.route('/properties', methods=['GET'])
    @restipy.format_as(AppProperties)
    def properties(self) -> AppProperties:
        """Gets the app properties

        :return: the app properties
        """
        return self.__app_properties

    @restipy.route('/status', methods=['GET'])
    def status(self):
        """Gets the status of the app

        Simply retrieves all users to check if the database is up.
        Returns nothing
        """
        self.__user_service.get_all_users()
