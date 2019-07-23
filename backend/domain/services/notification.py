import jinja2
import sendgrid
import os, logging

from sendgrid.helpers.mail import *
from ...modules.depynject import injectable


@injectable()
class NotificationService():

    def __init__(self):
        self.mailer = sendgrid.SendGridAPIClient(apikey=os.environ.get('SENDGRID_API_KEY'))
        self.app_url = os.environ.get('APP_URL')
        self.from_email = os.environ.get('SENDGRID_USERNAME')

    def send_reminder(self, max_level, notifications, user_email):
        title = '[NgPy-Accounts-Manager] Reminder: ' + max_level
        html = self.build_template(
            'emails/reminder.html',
            title,
            reminder_number=len(notifications),
            notifications=notifications
        )
        self.send_email(title, html, user_email)

    def build_template(self, template, title, **context):
        env = jinja2.Environment(
            loader=jinja2.PackageLoader('backend', 'templates')
        )
        tpl_engine = env.get_template(template)
        return tpl_engine.render(
            APP_NAME='NgPy-Accounts-Manager',
            APP_URL=self.app_url,
            TITLE=title,
            **context
        )

    def send_email(self, email_object, email_content, email_destination):
        from_email = Email(self.from_email)
        to_email = Email(email_destination)
        html_content = Content('text/html', email_content)
        mail_obj = Mail(from_email, email_object, to_email, html_content)
        response = self.mailer.client.mail.send.post(request_body=mail_obj.get())
        logging.debug('Email sent with status_code=%s', response.status_code)
        logging.debug('Email sent with headers=%s', response.headers)
        logging.debug('Email sent with body=%s', response.body)
