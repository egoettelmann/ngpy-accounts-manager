import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class SessionService implements Resolve<any> {

  constructor(private http: HttpClient, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.getConnectedUser();
  }

  login(loginForm: { username?: String, password?: String }): Observable<any> {
    return this.http.post<any>('/rest/session/login', loginForm);
  }

  logout(): Observable<any> {
    return this.http.delete<any>('/rest/session/logout');
  }

  getConnectedUser(): Observable<any> {
    return this.http.get<any>('/rest/session/user').catch(err => {
      this.router.navigate(['login']);
      return Observable.throw('User not connected');
    });
  }

}
