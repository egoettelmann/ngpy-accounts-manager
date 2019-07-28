import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppProperties } from '../../models/api.models';

@Injectable()
export class SessionRestService {

  constructor(private http: HttpClient) {
  }

  login(loginForm: { username?: String, password?: String }): Observable<any> {
    return this.http.post<any>('/rest/session/login', loginForm);
  }

  logout(): Observable<any> {
    return this.http.delete<any>('/rest/session/logout');
  }

  getSession(): Observable<any> {
    return this.http.get<any>('/rest/session/user');
  }

  getProperties(): Observable<AppProperties> {
    return this.http.get<AppProperties>('/rest/session/properties')
  }
}
