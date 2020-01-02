import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { CommonFunctions } from '../../shared/utils/common-functions';

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


  retrieve<T>(cacheKey: string, observable: Observable<T>): Observable<T> {
    if (!this.cache.hasOwnProperty(cacheKey)) {
      this.cache[cacheKey] = observable.pipe(
        shareReplay(1)
      );
    }
    return this.cache[cacheKey];
  }

  evict(cacheKeyPattern: string) {
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
