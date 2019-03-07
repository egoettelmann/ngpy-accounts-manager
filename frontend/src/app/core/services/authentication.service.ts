import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { SessionRestService } from './rest/session-rest.service';
import { of } from 'rxjs/observable/of';

@Injectable()
export class AuthenticationService {

  private currentUser: any;

  constructor(
    private http: HttpClient,
    private sessionRestService: SessionRestService
  ) {
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  getConnectedUser(): Observable<any> {
    if (this.currentUser !== undefined) {
      return of(this.currentUser);
    } else {
      return this.sessionRestService.getSession().pipe(
        tap(user => {
          this.currentUser = user;
        })
      );
    }
  }

}
