import { ChangeDetectorRef, Component } from '@angular/core';
import {AbstractNotificationComponent} from '../abstract-notification.component';
import {NotificationService} from '../../../../core/services/notification.service';

/**
 * The notification modal component
 */
@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html'
})
export class NotificationModalComponent extends AbstractNotificationComponent {

  /**
   * The CSS classes
   */
  public cssClasses = {
    textColor: {
      ERROR: 'text-danger',
      WARNING: 'text-warning',
      INFO: 'text-primary',
      SUCCESS: 'text-success'
    },
    bgColor: {
      ERROR: 'bg-danger',
      WARNING: 'bg-warning',
      INFO: 'bg-primary',
      SUCCESS: 'bg-success'
    },
    button: {
      ERROR: 'btn-danger',
      WARNING: 'btn-warning',
      INFO: 'btn-primary',
      SUCCESS: 'btn-success'
    },
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
