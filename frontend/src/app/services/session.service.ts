import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StateService } from '@uirouter/angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class SessionService {

  constructor(private http: HttpClient, private $state: StateService) {
  }

  login(loginForm: { username?: String, password?: String }): Observable<any> {
    return this.http.post<any>('/rest/session/login', loginForm);
  }

  logout(): Observable<any> {
    return this.http.delete<any>('/rest/session/logout');
  }

  getConnectedUser(): Observable<any> {
    return this.http.get<any>('/rest/session/user').catch(err => {
      this.$state.go('login');
      return Observable.throw('User not connected');
    });
  }

}
