import sys
import logging


sys.path.append('./site-packages')

from app.modules.depynject import Depynject
from app.modules.di_providers import SimplePrototypeDiProvider

from app.domain.services import NotificationService, AccountService

from app.main import create_app

# Configuring Dependency Injection
spdi_provider = SimplePrototypeDiProvider()
depynject_container = Depynject(providers={
    'request': spdi_provider.provide
})

# Building the App
app = create_app(depynject_container=depynject_container)

# Retrieving required services
notification_service: NotificationService = depynject_container.provide(NotificationService)
account_service: AccountService = depynject_container.provide(AccountService)

##########################
# Executing the Scheduler
##########################
if __name__ == '__main__':
    notification_level, notifications = account_service.get_notification_levels()

    logging.info('Notification max level: %s', notification_level)

    if notification_level is not None:
        notification_service.send_reminder(notification_level, notifications, 'elio.goettelmann@gmail.com')
