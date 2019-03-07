import { ChangeDetectorRef, Component } from '@angular/core';
import {AbstractNotificationComponent} from '../abstract-notification.component';
import {NotificationService} from '../../../../core/services/notification.service';

@Component({
  selector: 'app-notification-message',
  templateUrl: './notification-message.component.html'
})
export class NotificationMessageComponent extends AbstractNotificationComponent {

  public cssClasses = {
    alert: {
      ERROR: 'alert-danger',
      WARNING: 'alert-warning',
      INFO: 'alert-primary',
      SUCCESS: 'alert-success'
    }
  };

  constructor(
    protected notificationService: NotificationService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    super(notificationService, changeDetectorRef);
  }

}
