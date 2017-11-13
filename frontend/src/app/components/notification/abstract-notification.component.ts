import {Input} from '@angular/core';
import {NotificationService} from './notification.service';
import {Notification, NotificationType} from './notification';

export abstract class AbstractNotificationComponent {

  @Input() public type?: NotificationType;
  @Input() public dismiss?: number;

  public errorNotification: Notification;
  public showNotification = false;

  constructor(protected notificationService: NotificationService) {
    notificationService.subscribe((n) => {
      this.errorNotification = n;
      this.showNotification = true;
      if (this.dismiss !== undefined) {
        setTimeout(
          () => this.hideNotification(),
          this.dismiss
        );
      }
    }, this.type);
  }

  public hideNotification(): void {
    this.showNotification = false;
  }

}
