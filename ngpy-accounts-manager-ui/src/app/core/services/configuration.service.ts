import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';

/**
 * The configuration service.
 */
@Injectable()
export class ConfigurationService {

  /**
   * The app properties observable.
   */
  private appProperties?: Observable<any>;

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
      this.appProperties = this.http.get('/assets/config/application.json').pipe(
        publishReplay(1),
        refCount()
      );
    }
    return this.appProperties;
  }

}
