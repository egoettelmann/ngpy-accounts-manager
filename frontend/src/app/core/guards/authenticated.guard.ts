import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

/**
 * The authentication guard
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate {

  /**
   * Instantiates the guard.
   *
   * @param authenticationService the authentication service
   * @param router the router
   */
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  /**
   * Checks if the route can be activated, otherwise redirects to the login page.
   *
   * @param route the activated route
   * @param state the state
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authenticationService.getConnectedUser().pipe(
      catchError(err => {
        this.router.navigate(['login']);
        return throwError(err);
      }),
      map(user => {
        return !!user;
      })
    );
  }

}
