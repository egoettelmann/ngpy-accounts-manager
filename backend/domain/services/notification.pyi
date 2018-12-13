from sendgrid import SendGridAPIClient

from ..models import Notification


class NotificationService():
    mailer: SendGridAPIClient
    app_url: str
    from_email: str

    def send_reminder(self,
                      max_level: str,
                      notifications: list(Notification),
                      user_email: str) -> None : ...

    def build_template(self,
                       template: str,
                       title: str,
                       **context) -> str : ...

    def send_email(self,
                   email_object: str,
                   email_content: str,
                   email_destination: str) -> None : ...
