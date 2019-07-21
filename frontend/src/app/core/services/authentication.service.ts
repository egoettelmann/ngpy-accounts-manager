import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SessionRestService } from './rest/session-rest.service';

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
