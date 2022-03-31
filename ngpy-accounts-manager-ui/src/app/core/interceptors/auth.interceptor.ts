import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RouterService } from '../services/router.service';

/**
 * The auth interceptor
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  /**
   * Instantiates the interceptor.
   *
   * @param routerService the router service
   */
  constructor(private routerService: RouterService) {
  }

  /**
   * Intercepts the request to add the withCredentials flag.
   *
   * @param req the request
   * @param next the handler
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let apiReq = req.clone();

    // If request to API, adding the withCredentials flag to send Cookie on CORS request
    if (!req.url.startsWith('/assets')) {
      apiReq = req.clone({ withCredentials: true });
    }

    // Catch Unauthorized exception to redirect to login
    return next.handle(apiReq).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.routerService.navigate('route.login');
            return EMPTY;
          }
        }
        return throwError(err);
      })
    );
  }

}
