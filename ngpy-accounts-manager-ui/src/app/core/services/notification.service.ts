import { Injectable } from '@angular/core';
import { Notification, NotificationType } from '../models/domain.models';
import { filter } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

/**
 * The notification service
 */
@Injectable()
export class NotificationService {

  /**
   * The subject to publish notifications
   */
  private handler = new Subject<Notification>();

  /**
   * Broadcasts a notification to all subscriptions.
   *
   * @param notification the notification to broadcast
   */
  notify(notification: Notification): void {
    this.handler.next(notification);
  }

  /**
   * Gets all notifications of a given type.
   *
   * @param type the optional type (if undefined, all notifications will be returned)
   */
  get(type?: NotificationType): Observable<Notification> {
    return this.handler.asObservable().pipe(
      filter(n => type === undefined || n.type === type)
    );
  }

}
