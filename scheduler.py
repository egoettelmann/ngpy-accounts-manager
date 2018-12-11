from datetime import datetime, timedelta

import index

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
notification_content = ''

for acc in accounts_list:
    acc_content = None
    print('Account ' + acc.name + ' last updated on ', acc.last_update)
    if acc.last_update < info_limit:
        max_level = max(max_level, 1)
        acc_content = 'INFO: ' \
                      + 'Account ' + acc.name \
                      + ' has been updated on ' + str(acc.last_update)
        if max_level == 1:
            notification_level = 'INFO'
    if acc.last_update < warn_limit:
        max_level = max(max_level, 2)
        acc_content = 'WARN: ' \
                      + 'Account ' + acc.name \
                      + ' has been updated on ' + str(acc.last_update)
        if max_level == 2:
            notification_level = 'WARNING'
    if acc.last_update < error_limit:
        max_level = max(max_level, 3)
        acc_content = 'ERROR: ' \
                      + 'Account ' + acc.name \
                      + ' has been updated on ' + str(acc.last_update)
        if max_level == 3:
            notification_level = 'ERROR'
    if acc_content is not None:
        notification_content = notification_content + '\n' + acc_content

print('Notification: ', notification_level, notification_content)

if notification_level is not None:
    notification_service.send_notification(notification_level, notification_content)
