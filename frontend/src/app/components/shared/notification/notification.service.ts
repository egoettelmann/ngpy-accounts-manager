import {Injectable} from '@angular/core';
import {Notification} from './notification';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

type NotificationCallback = (notification: Notification) => void | any;

@Injectable()
export class NotificationService {

  private handler = new Subject<Notification>();

  broadcast(notification: Notification): void {
    this.handler.next(notification);
  }

  subscribe(callback: NotificationCallback, type?: string): Subscription {
    return this.handler
      .filter(n => type === undefined || n.type === type)
      .subscribe(callback);
  }

}
