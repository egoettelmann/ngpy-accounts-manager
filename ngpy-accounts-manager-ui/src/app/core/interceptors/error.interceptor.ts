import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { RestError } from '../models/api.models';

/**
 * The fallback error (for unknown errors)
 */
const FALLBACK_ERROR: RestError = {
  code: 'T500',
  message: 'unexpected_error'
};

function buildRestError(err: any): RestError {
  // Not an HTTP error: returning fallback with context
  if (!(err instanceof HttpErrorResponse)) {
    return {
      ...FALLBACK_ERROR,
      context: err
    };
  }

  // No error details provided: returning fallback with context
  if (err.error === undefined) {
    return {
      ...FALLBACK_ERROR,
      context: err
    };
  }

  // Extracting details
  return err.error as RestError;
}

/**
 * Intercepts the request to transform any errors happening on the HTTP call.
 * Any error will be transformed into a Notification.
 * Additionally, 5xx errors will be displayed in an error modal (except for 503).
 *
 * @param req the request
 * @param next the next handler function
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  const apiReq = req.clone();
  return next(apiReq).pipe(
    catchError((err: any) => {
      // Transforming error into RestError
      const restError = buildRestError(err);

      // Technical exception are notified (to be displayed in modal)
      if (err.status > 500 && err.status !== 503) {
        notificationService.notify({
          type: 'ERROR',
          ...restError
        });
      }

      // Errors are re-thrown as RestErrors
      return throwError(() => restError);
    })
  );
};
