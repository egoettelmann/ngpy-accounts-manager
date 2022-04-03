import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { RouterService } from '../services/router.service';

/**
 * The authentication guard
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate {

  /**
   * Instantiates the guard.
   *
   * @param authenticationService the authentication service
   * @param routerService the router service
   */
  constructor(
    private authenticationService: AuthenticationService,
    private routerService: RouterService
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
      catchError(() => {
        this.routerService.navigate('route.login');
        return EMPTY;
      }),
      map(user => {
        return !!user;
      })
    );
  }

}
