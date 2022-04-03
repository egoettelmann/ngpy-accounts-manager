import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '@core/services/notification.service';
import { Subscription } from 'rxjs';
import { Notification } from '@core/models/domain.models';

/**
 * The notification modal component
 */
@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html'
})
export class NotificationModalComponent implements OnInit, OnDestroy {

  /**
   * The subscription to the notifications
   */
  private subscription?: Subscription;

  /**
   * The current error notification
   */
  public notification?: Notification;

  /**
   * The translation prefix
   */
  public translationPrefix = 'i18n.error.';

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
    }
  };

  /**
   * Instantiates the component.
   *
   * @param notificationService the notification service
   */
  constructor(private notificationService: NotificationService) {
  }

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.startSubscription();
  }

  /**
   * Destroys the component
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Hides the current notification
   */
  hideNotification(): void {
    this.notification = undefined;
  }

  /**
   * Starts the subscription to the notifications
   */
  private startSubscription(): void {
    this.subscription = this.notificationService.get().subscribe((notification) => {
      this.notification = notification;
    });
  }

}
