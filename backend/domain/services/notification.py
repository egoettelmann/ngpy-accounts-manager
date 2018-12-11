import sendgrid
import os
from sendgrid.helpers.mail import *
from ...modules.depynject import injectable


@injectable()
class NotificationService():

    def send_notification(self, level, content):
        sg = sendgrid.SendGridAPIClient(apikey=os.environ.get('SENDGRID_API_KEY'))
        from_email = Email("ngpy-accounts-manager@github.com")
        subject = "NgPy-Accounts-Manager: " + level
        to_email = Email("elio.goettelmann@gmail.com")
        content = Content("text/plain", content)
        mail = Mail(from_email, subject, to_email, content)
        response = sg.client.mail.send.post(request_body=mail.get())
        print(response.status_code)
        print(response.body)
        print(response.headers)
