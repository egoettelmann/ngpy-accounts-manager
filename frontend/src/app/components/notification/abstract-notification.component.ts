import {Input, OnChanges, SimpleChanges} from '@angular/core';
import {NotificationService} from './notification.service';
import {Notification} from './notification';
import {Subscription} from 'rxjs/Subscription';

export abstract class AbstractNotificationComponent implements OnChanges {

  @Input() public type?: string;
  @Input() public dismiss?: number;

  private subscription: Subscription;
  public errorNotification: Notification;
  public showNotification = false;
  public translationPrefix = 'i18n.error.';

  constructor(protected notificationService: NotificationService) {
    this.startSubscription();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.type || this.subscription === undefined) {
      if (this.subscription !== undefined) {
        console.log('Resetting subscription');
        this.subscription.unsubscribe();
      }
      console.log('subscribing to ', this.type);
      this.startSubscription();
    }
  }

  private startSubscription() {
    this.subscription = this.notificationService.subscribe((n) => {
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
