import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { RestError } from '../models/api.models';

/**
 * The error interceptor
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  /**
   * The fallback error (for unknown errors)
   */
  private readonly fallbackError: RestError = {
    code: 'T500',
    message: 'unexpected_error'
  };

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
   * Intercepts the request to transform any errors happening on the HTTP call.
   * Any error will be transformed into a Notification.
   * Additionally, 500 errors will be notified (to be displayed in modal).
   *
   * @param req the request
   * @param next the handler
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiReq = req.clone();
    return next.handle(apiReq).pipe(
      catchError((err: any) => {
        // Transforming error into RestError
        const restError = this.buildRestError(err);

        // Technical exception are notified (to be displayed in modal)
        if (err.status > 500) {
          this.notificationService.notify({
            type: 'ERROR',
            ...restError
          });
        }

        // Errors are re-thrown as RestErrors
        return throwError(restError);
      })
    );
  }

  private buildRestError(err: any): RestError {
    // Not an HTTP error: returning fallback with context
    if (!(err instanceof HttpErrorResponse)) {
      return {
        ...this.fallbackError,
        context: err
      };
    }

    // No error details provided: returning fallback with context
    if (err.error === undefined) {
      return {
        ...this.fallbackError,
        context: err
      };
    }

    // Extracting details
    return err.error as RestError;
  }

}
