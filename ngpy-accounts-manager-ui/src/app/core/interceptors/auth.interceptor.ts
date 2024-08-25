import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RouterService } from '../services/router.service';

/**
 * Intercepts the request to add the withCredentials flag.
 *
 * @param req the request
 * @param next the next handler function
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const routerService = inject(RouterService);
  let apiReq = req.clone();

  // If request to API, adding the withCredentials flag to send Cookie on CORS request
  if (!req.url.startsWith('/assets')) {
    apiReq = req.clone({ withCredentials: true });
  }

  // Catch Unauthorized exception to redirect to login
  return next(apiReq).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          routerService.navigate('route.login');
          return EMPTY;
        }
      }
      return throwError(err);
    })
  );
};
