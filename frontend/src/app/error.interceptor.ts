import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).do((event: HttpEvent<any>) => {
      // do stuff with response if you want
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 403) {
          console.log('NOT AUTHORIZED');
        }
      }
    });
  }

}
