import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import {NotificationService} from './components/notification/notification.service';
import {Notification} from './components/notification/notification';
import { environment } from '../environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  private notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const apiReq = req.clone();
    const baseUrl = environment.baseUrl;
    let apiReq = req.clone();
    if (!req.url.startsWith('/assets')) {
      apiReq = req.clone({url: baseUrl + req.url, withCredentials: true});
    }
    return next.handle(apiReq).do((event: HttpEvent<any>) => {
      // do stuff with response if you want
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        const notif = new Notification('ERROR', 'T500', 'unhandled_server_error');
        if (err.error !== undefined) {
          notif.code = err.error.code;
          notif.content = err.error.message;
        }
        this.notificationService.broadcast(notif);
      }
    });
  }

}
