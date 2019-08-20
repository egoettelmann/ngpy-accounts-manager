import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SessionRestService } from './rest/session-rest.service';

/**
 * The authentication service
 */
@Injectable()
export class AuthenticationService {

  /**
   * The current user
   */
  private currentUser: any;

  /**
   * Instantiates the service.
   *
   * @param http the HTTP client
   * @param sessionRestService the session rest service
   */
  constructor(
    private http: HttpClient,
    private sessionRestService: SessionRestService
  ) {
  }

  /**
   * Get the currently connected user.
   */
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
