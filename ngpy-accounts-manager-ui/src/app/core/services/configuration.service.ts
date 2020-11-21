import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * The configuration service.
 */
@Injectable()
export class ConfigurationService {

  /**
   * Instantiates the service.
   *
   * @param http the HTTP client
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Gets all labels
   */
  getAppProperties(): Observable<any> {
    return this.http.get('/assets/config/application.json');
  }

}
