import {Component} from '@angular/core';
import {AbstractNotificationComponent} from './abstract-notification.component';
import {NotificationService} from './notification.service';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html'
})
export class NotificationModalComponent extends AbstractNotificationComponent {

  constructor(protected notificationService: NotificationService) {
    super(notificationService);
  }

}
