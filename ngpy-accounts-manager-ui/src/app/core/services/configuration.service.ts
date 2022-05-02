import { Injectable } from '@angular/core';
import { merge, Observable, of, throwError, timer } from 'rxjs';
import { catchError, map, mergeMap, publishReplay, refCount, takeWhile } from 'rxjs/operators';
import { ConfigRestService } from '@core/services/rest/config-rest.service';
import { AppProperties } from '@core/models/api.models';

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
   * @param configRestService the config rest service
   */
  constructor(private configRestService: ConfigRestService) {
  }

  /**
   * Gets all labels
   */
  getApiConfiguration(): Observable<any> {
    if (this.appProperties == null) {
      this.appProperties = this.configRestService.getConfiguration().pipe(
        publishReplay(1),
        refCount()
      );
    }
    return this.appProperties;
  }

  /**
   * Gets the API properties
   */
  getApiProperties(): Observable<AppProperties> {
    return this.configRestService.getProperties();
  }

  /**
   * Gets the API status.
   *
   * @param timeout the total timeout (in milliseconds)
   * @param maxAttempts the number of max attempts to get the status
   */
  getApiStatus(timeout: number, maxAttempts: number): Observable<{ready: boolean, progress?: number}> {
    const period = 100;
    const delay = timeout / maxAttempts;
    let ongoing = false;
    let currentTime = 0;
    let currentAttempt = 0;

    return timer(0, period).pipe(
      map(i => {
        currentTime = i * period;
        return {
          ready: false,
          progress: Math.min((currentTime * 100) / timeout, 100)
        };
      }),
      mergeMap(d => {
        // Ongoing call or no call to perform yet: forwarding value
        const nextAttemptTime = currentAttempt * delay;
        if (ongoing || currentTime < nextAttemptTime) {
          return of(d);
        }

        // Max attempts reached: throwing error
        currentAttempt++;
        if (currentAttempt >= maxAttempts) {
          return throwError('Max attempts reached');
        }

        // Performing API call
        ongoing = true;
        return merge(
          // Forwarding current value
          of(d),
          // Performing API call
          this.configRestService.getStatus().pipe(
            // Success
            map(() => {
              ongoing = false;
              return {
                ready: true
              };
            }),
            // Error returned as value
            catchError(() => {
              ongoing = false;
              return of({
                ready: false,
                progress: Math.min((currentTime * 100) / timeout, 100)
              });
            })
          )
        );
      }),
      takeWhile(d => !d.ready, true),
    );
  }

}
