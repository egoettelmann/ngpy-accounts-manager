import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * The auth interceptor
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  /**
   * Intercepts the request to add the withCredentials flag.
   *
   * @param req the request
   * @param next the handler
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let apiReq = req.clone();
    if (!req.url.startsWith('/assets')) {
      apiReq = req.clone({ withCredentials: true });
    }
    return next.handle(apiReq);
  }

}
