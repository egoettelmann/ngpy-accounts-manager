import sys

sys.path.append('./site-packages')

import logging

from app.main import entity_manager
from app.domain.services import AccountService, NotificationService
from app.modules.depynject import Depynject
from app.modules.di_providers import SimplePrototypeDiProvider

# Configuring Dependency Injection
spdi_provider = SimplePrototypeDiProvider()
depynject_container = Depynject(providers={
    'request': spdi_provider.provide
})
depynject_container.register_singleton(entity_manager)
notification_service = depynject_container.provide(NotificationService)
account_service = depynject_container.provide(AccountService)

##########################
# Executing the Scheduler
##########################
if __name__ == '__main__':
    notification_level, notifications = account_service.get_notification_levels()

    logging.info('Notification max level: %s', notification_level)

    if notification_level is not None:
        notification_service.send_reminder(notification_level, notifications, 'elio.goettelmann@gmail.com')
