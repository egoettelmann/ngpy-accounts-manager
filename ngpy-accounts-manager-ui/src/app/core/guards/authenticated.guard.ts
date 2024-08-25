import { CanActivateFn } from '@angular/router';
import { EMPTY } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { catchError, map } from 'rxjs/operators';
import { inject } from '@angular/core';
import { RouterService } from '../services/router.service';

/**
 * Checks if the route can be activated, otherwise redirects to the login page.
 */
export function authenticatedGuard(): CanActivateFn {
  return () => {
    const authenticationService: AuthenticationService = inject(AuthenticationService);
    const routerService: RouterService = inject(RouterService);

    return authenticationService.getConnectedUser().pipe(
      catchError(() => {
        routerService.navigate('route.login');
        return EMPTY;
      }),
      map(user => {
        return !!user;
      })
    );
  };
}
