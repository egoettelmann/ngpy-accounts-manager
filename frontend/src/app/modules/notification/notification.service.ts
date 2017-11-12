import {EventEmitter, Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Notification} from './notification';

@Injectable()
export class NotificationService {

  private eventEmitter: EventEmitter<Notification> = new EventEmitter();

  notify(notification: Notification): void {
    this.eventEmitter.emit(notification);
  }

  getEventEmitter(): EventEmitter<Notification> {
    return this.eventEmitter;
  }

}
