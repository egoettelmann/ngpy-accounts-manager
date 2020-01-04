import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, zip } from 'rxjs';
import { LabelsRestService } from '../rest/labels-rest.service';
import { CategoriesRestService } from '../rest/categories-rest.service';
import { take } from 'rxjs/operators';

/**
 * The main resolver service
 */
@Injectable()
export class MainResolverService implements Resolve<any> {

  /**
   * Instantiates the service.
   *
   * @param labelsRestService the labels rest service
   * @param categoriesRestService the categories rest service
   */
  constructor(private labelsRestService: LabelsRestService,
              private categoriesRestService: CategoriesRestService
  ) {
  }

  /**
   * Resolves all services to setup the cache.
   *
   * @param route the activated route snapshot
   * @param state the router state snapshot
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return zip(
      this.labelsRestService.getAll().pipe(take(1)),
      this.categoriesRestService.getAll().pipe(take(1))
    );
  }

}
