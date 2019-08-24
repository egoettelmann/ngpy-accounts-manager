import { ChangeDetectorRef, Component } from '@angular/core';
import {AbstractNotificationComponent} from '../abstract-notification.component';
import {NotificationService} from '../../../../core/services/notification.service';

/**
 * The notification message component
 */
@Component({
  selector: 'app-notification-message',
  templateUrl: './notification-message.component.html'
})
export class NotificationMessageComponent extends AbstractNotificationComponent {

  /**
   * The CSS class
   */
  public cssClasses = {
    alert: {
      ERROR: 'danger',
      WARNING: 'warning',
      INFO: 'primary',
      SUCCESS: 'success'
    }
  };

  /**
   * Instantiates the component.
   *
   * @param notificationService the notification service
   * @param changeDetectorRef the change detector ref
   */
  constructor(
    protected notificationService: NotificationService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    super(notificationService, changeDetectorRef);
  }

}
