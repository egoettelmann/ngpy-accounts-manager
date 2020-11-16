import logging
import os
from typing import List

import jinja2
import sendgrid
from sendgrid.helpers.mail import *

from ..models import Notification
from ...modules.depynject import injectable


@injectable()
class NotificationService:
    """
    The notification service class that defines all business operations.
    """

    def __init__(self):
        """Constructor
        """
        self.__mailer = sendgrid.SendGridAPIClient(apikey=os.environ.get('SENDGRID_API_KEY'))
        self.__app_url = os.environ.get('APP_URL')
        self.__from_email = os.environ.get('SENDGRID_USERNAME')

    def send_reminder(self,
                      max_level: str,
                      notifications: List[Notification],
                      user_email: str
                      ) -> None:
        """Sends a list of notifications as email to a provided email address.

        :param max_level: the max level
        :param notifications: the list of notifications
        :param user_email: the user email
        """
        title = '[NgPy-Accounts-Manager] Reminder: ' + max_level
        html = self.build_template(
            'emails/reminder.html',
            title,
            reminder_number=len(notifications),
            notifications=notifications
        )
        self.send_email(title, html, user_email)

    def build_template(self, template: str, title: str, **context) -> str:
        """Builds the provided email template and renders it.

        :param template: the template to build
        :param title: the title of the email
        :param context: the context for the rendering
        :return: the build template
        """
        env = jinja2.Environment(
            loader=jinja2.PackageLoader('api', 'templates')
        )
        tpl_engine = env.get_template(template)
        return tpl_engine.render(
            APP_NAME='NgPy-Accounts-Manager',
            APP_URL=self.__app_url,
            TITLE=title,
            **context
        )

    def send_email(self, email_object: str, email_content: str, email_destination: str) -> None:
        """Sends an email.

        :param email_object: the object
        :param email_content: the content
        :param email_destination: destination address
        """
        from_email = Email(self.__from_email)
        to_email = Email(email_destination)
        html_content = Content('text/html', email_content)
        mail_obj = Mail(from_email, email_object, to_email, html_content)
        response = self.__mailer.client.mail.send.post(request_body=mail_obj.get())
        logging.debug('Email sent with status_code=%s', response.status_code)
        logging.debug('Email sent with headers=%s', response.headers)
        logging.debug('Email sent with body=%s', response.body)
