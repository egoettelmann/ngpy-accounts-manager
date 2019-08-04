import logging
import os

from backend.dbconnector.manager import EntityManager
from backend.domain.services.account_service import AccountService
from backend.domain.services.notification_service import NotificationService
from backend.modules.depynject import Depynject
from backend.modules.di_providers import SimplePrototypeDiProvider

######################
# Configuring Logging
######################
logging.basicConfig(format='%(asctime)s - %(thread)d - %(levelname)s - %(name)s - %(message)s', level=logging.DEBUG)

###################################
# Configuring Dependency Injection
###################################
spdi_provider = SimplePrototypeDiProvider()
d_injector = Depynject(providers={
    'request': spdi_provider.provide
})

# Configuring Entity Manager
em = EntityManager(os.environ['DATABASE_URL'])
d_injector.register_singleton(em)


##########################
# Executing the Scheduler
##########################
notification_service = d_injector.provide(NotificationService)
account_service = d_injector.provide(AccountService)

notification_level, notifications = account_service.get_notification_levels()

logging.info('Notification max level: %s', notification_level)

if notification_level is not None:
    notification_service.send_reminder(notification_level, notifications, 'elio.goettelmann@gmail.com')
