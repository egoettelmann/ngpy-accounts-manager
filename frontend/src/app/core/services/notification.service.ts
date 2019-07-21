import { Injectable } from '@angular/core';
import { Notification } from '../models/domain.models';
import { filter } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

type NotificationCallback = (notification: Notification) => void | any;

@Injectable()
export class NotificationService {

  private handler = new Subject<Notification>();

  broadcast(notification: Notification): void {
    this.handler.next(notification);
  }

  subscribe(callback: NotificationCallback, type?: string): Subscription {
    return this.handler.pipe(
      filter(n => type === undefined || n.type === type)
    ).subscribe(callback);
  }

}
