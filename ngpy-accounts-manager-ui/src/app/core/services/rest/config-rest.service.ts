import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AppProperties } from '../../models/api.models';
import { catchError, concatMap, delay, map, retryWhen, take } from 'rxjs/operators';

/**
 * The config rest service.
 */
@Injectable()
export class ConfigRestService {

  /**
   * Instantiates the service.
   *
   * @param http the HTTP client
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Gets the API configuration
   */
  getConfiguration(): Observable<any> {
    return this.http.get('/assets/config/application.json');
  }

  /**
   * Gets the application properties
   */
  getProperties(): Observable<AppProperties> {
    return this.http.get<AppProperties>('/rest/config/properties');
  }

  /**
   * Gets the application properties
   */
  getStatus(): Observable<void> {
    return this.http.get<void>('/rest/config/status');
  }

}
