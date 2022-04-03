import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { CommonFunctions } from '@shared/utils/common-functions';

/**
 * The cache service
 */
@Injectable()
export class CacheService {

  /**
   * The cache
   */
  private cache: {
    [key: string]: Observable<any>
  } = {};

  /**
   * Retrieves an observable from the cache (otherwise registers it).
   *
   * @param cacheKey the cache key
   * @param observable the observable to use if cache not present
   */
  retrieve<T>(cacheKey: string, observable: Observable<T>): Observable<T> {
    if (!this.cache.hasOwnProperty(cacheKey)) {
      this.cache[cacheKey] = observable.pipe(
        shareReplay(1)
      );
    }
    return this.cache[cacheKey];
  }

  /**
   * Evicts all values from the cache with a key matching the pattern.
   *
   * @param cacheKeyPattern the cache key pattern
   */
  evict(cacheKeyPattern: string): void {
    for (const cacheKey in this.cache) {
      if (!this.cache.hasOwnProperty(cacheKey)) {
        continue;
      }
      if (CommonFunctions.matches(cacheKey, cacheKeyPattern)) {
        delete this.cache[cacheKey];
      }
    }
  }

}
