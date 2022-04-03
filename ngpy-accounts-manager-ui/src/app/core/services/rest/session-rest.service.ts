import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppProperties } from '../../models/api.models';

/**
 * The session rest service.
 */
@Injectable()
export class SessionRestService {

  /**
   * Instantiates the service.
   *
   * @param http the HTTP client
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Performs a login request.
   *
   * @param loginForm the login form (username/password)
   */
  login(loginForm: { username?: string, password?: string }): Observable<any> {
    return this.http.post<any>('/rest/session/login', loginForm);
  }

  /**
   * Performs a logout request
   */
  logout(): Observable<any> {
    return this.http.delete<any>('/rest/session/logout');
  }

  /**
   * Gets the details of the current session.
   */
  getSession(): Observable<any> {
    return this.http.get<any>('/rest/session/user');
  }

  /**
   * Gets the application properties
   */
  getProperties(): Observable<AppProperties> {
    return this.http.get<AppProperties>('/rest/session/properties');
  }

}
