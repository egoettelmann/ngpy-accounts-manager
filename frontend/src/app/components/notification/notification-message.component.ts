import {Component} from '@angular/core';
import {AbstractNotificationComponent} from './abstract-notification.component';
import {NotificationService} from './notification.service';

@Component({
  selector: 'app-notification-message',
  templateUrl: './notification-message.component.html'
})
export class NotificationMessageComponent extends AbstractNotificationComponent {

  constructor(protected notificationService: NotificationService) {
    super(notificationService);
  }

}
