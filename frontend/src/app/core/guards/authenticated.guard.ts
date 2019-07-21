import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticatedGuard implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

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
