import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * The configuration service.
 */
@Injectable()
export class ConfigurationService {

  /**
   * The app properties.
   */
  private appProperties: any;

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
    if (this.appProperties == null) {
      return this.http.get('/assets/config/application.json').pipe(
        tap(data => {
          this.appProperties = data;
        })
      );
    }
    return of(this.appProperties);
  }

}
