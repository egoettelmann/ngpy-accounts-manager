import {Component} from '@angular/core';
import {NotificationService} from './notification.service';
import {Notification} from './notification';

@Component({
  templateUrl: './notification-modal.component.html'
})
export class NotificationModalComponent {

  public errorNotification: Notification;
  public showErrorModal = false;

  constructor(private notificationService: NotificationService) {
    notificationService.getEventEmitter().subscribe((n) => {
      this.errorNotification = n;
      this.showErrorModal = true;
    });
  }

}
