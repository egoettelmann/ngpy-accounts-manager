import logging

from datetime import datetime, timedelta

import index

from backend.domain.models import Notification
from backend.domain.services.notification import NotificationService
from backend.domain.services.account import AccountService
from backend.modules.di_providers import SimplePrototypeDiProvider

spdi_provider = SimplePrototypeDiProvider()
index.d_injector.providers = {
    'request': spdi_provider.provide
}
notification_service = index.d_injector.provide(NotificationService)
account_service = index.d_injector.provide(AccountService)

accounts_list = account_service.get_all_accounts()

info_limit = datetime.date(datetime.today() - timedelta(days=30))
warn_limit = datetime.date(datetime.today() - timedelta(days=60))
error_limit = datetime.date(datetime.today() - timedelta(days=80))

max_level = 0
notification_level = None
notifications = []

for acc in accounts_list:
    if not acc.notify:
        continue
    logging.info('Account %s last updated on %s', acc.name, acc.last_update)
    if acc.last_update < error_limit:
        max_level = max(max_level, 3)
        notif = Notification(acc.name, 'ERROR', str(acc.last_update))
        notifications.append(notif)
        if max_level == 3:
            notification_level = 'ERROR'
    elif acc.last_update < warn_limit:
        max_level = max(max_level, 2)
        notif = Notification(acc.name, 'WARNING', str(acc.last_update))
        notifications.append(notif)
        if max_level == 2:
            notification_level = 'WARNING'
    elif acc.last_update < info_limit:
        max_level = max(max_level, 1)
        notif = Notification(acc.name, 'INFO', str(acc.last_update))
        notifications.append(notif)
        if max_level == 1:
            notification_level = 'INFO'

logging.info('Notification max level: %s', notification_level)

if notification_level is not None:
    notification_service.send_reminder(notification_level, notifications, 'elio.goettelmann@gmail.com')
