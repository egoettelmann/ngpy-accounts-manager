import { Injectable } from '@angular/core';
import { Notification } from '../models/domain.models';
import { filter } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

type NotificationCallback = (notification: Notification) => void | any;

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
  broadcast(notification: Notification): void {
    this.handler.next(notification);
  }

  /**
   * Subscribes a callback to a given type of notification.
   *
   * @param callback the callback to execute
   * @param type the optional type (if undefined, subscribes to all notifications)
   */
  subscribe(callback: NotificationCallback, type?: string): Subscription {
    return this.handler.pipe(
      filter(n => type === undefined || n.type === type)
    ).subscribe(callback);
  }

}
