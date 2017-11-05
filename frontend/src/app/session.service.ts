import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StateService} from '@uirouter/angular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SessionService {

  constructor(private http: HttpClient, private $state: StateService) {}

  login(loginForm: {username?: String, password?: String}): Promise<any> {
    return this.http.post<any>('/rest/session/login', loginForm).toPromise();
  }

  logout(): Promise<any> {
    return this.http.delete<any>('/rest/session/logout').toPromise();
  }

  getConnectedUser(): Promise<any> {
    return this.http.get<any>('/rest/session/user').toPromise().then(data => {
      return data;
    }, err => {
      this.$state.go('login');
    });
  }

}
