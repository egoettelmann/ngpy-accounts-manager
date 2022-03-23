import { ChangeDetectorRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/models/domain.models';
import { Subscription } from 'rxjs';

/**
 * The abstract notification component
 */
export abstract class AbstractNotificationComponent implements OnChanges {

  /**
   * The notification type that the component handles
   */
  @Input() public type?: string;

  /**
   * If the notification is dismissible.
   */
  @Input() public dismiss?: number;

  /**
   * The subscription to the notifications
   */
  private subscription: Subscription;

  /**
   * The current error notification
   */
  public notification: Notification;

  /**
   * The show notification flag
   */
  public showNotification = false;

  /**
   * The translation prefix
   */
  public translationPrefix = 'i18n.error.';

  /**
   * Instantiates the component.
   *
   * @param notificationService the notification service
   * @param changeDetectorRef the change detector ref
   */
  protected constructor(
    protected notificationService: NotificationService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    this.startSubscription();
  }

  /**
   * Handles all input changes.
   *
   * @param changes the input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.type || this.subscription === undefined) {
      if (this.subscription !== undefined) {
        this.subscription.unsubscribe();
      }
      this.startSubscription();
    }
  }

  /**
   * Hides the current notification
   */
  hideNotification(): void {
    this.showNotification = false;
  }

  /**
   * Starts the subscription to the notifications
   */
  private startSubscription() {
    this.subscription = this.notificationService.subscribe((n) => {
      this.notification = n;
      this.showNotification = true;
      if (this.dismiss !== undefined) {
        setTimeout(
          () => this.hideNotification(),
          this.dismiss
        );
      }
      this.changeDetectorRef.detectChanges();
    }, this.type);
  }

}
