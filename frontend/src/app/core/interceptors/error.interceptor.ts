import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../services/notification.service';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

/**
 * The error interceptor
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  /**
   * The notification service.
   */
  private notificationService: NotificationService;

  /**
   * Instantiates the interceptor.
   *
   * @param notificationService the notification service
   */
  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  /**
   * Intercepts the request to notify for any error happening on an HTTP call.
   *
   * @param req the request
   * @param next the handler
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const apiReq = req.clone();
    const baseUrl = environment.baseUrl;
    let apiReq = req.clone();
    if (!req.url.startsWith('/assets')) {
      apiReq = req.clone({url: baseUrl + req.url, withCredentials: true});
    }
    return next.handle(apiReq).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          const notif = {
            type: 'ERROR',
            code: 'T500',
            content: 'unhandled_server_error'
          };
          if (err.error !== undefined) {
            notif.code = err.error.code;
            notif.content = err.error.message;
          }
          this.notificationService.broadcast(notif);
        }
        return throwError(err);
      })
    );
  }

}
