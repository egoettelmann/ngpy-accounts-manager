import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { DateService } from './date.service';
import { Location } from '@angular/common';
import { RouterPathPipe } from '@shared/modules/router-path/router-path.pipe';

/**
 * The Router service
 */
@Injectable()
export class RouterService {

  constructor(private router: Router,
              private routerPathPipe: RouterPathPipe,
              private location: Location,
              private dateService: DateService
  ) {
  }

  navigate(routeKey: string, pathVariables?: Params, extras?: NavigationExtras): void {
    const routePath = this.routerPathPipe.transform(routeKey, pathVariables);
    this.router.navigate(routePath, extras);
  }

  refresh(activatedRoute: ActivatedRoute, queryParams?: Params): void {
    this.router.navigate([],
      {
        relativeTo: activatedRoute,
        queryParams,
        queryParamsHandling: 'merge'
      });
  }

  openTransactionForm(transactionId?: number): void {
    this.navigate('route.forms.transaction', {
      transactionId
    }, {
      queryParamsHandling: 'preserve'
    });
  }

  getYear(route: ActivatedRoute): number {
    const year = route.snapshot.queryParamMap.get('year');
    if (year == null) {
      return this.dateService.getCurrentYear();
    }
    return +year;
  }

  setYear(year: number, params: Params): Params {
    if (year == null) {
      return params;
    }
    return Object.assign({}, params, { year });
  }

  getMonth(route: ActivatedRoute): number {
    const month = route.snapshot.queryParamMap.get('month');
    if (month == null) {
      return this.dateService.getCurrentMonth();
    }
    return +month;
  }

  setMonth(month: number, params: Params): Params {
    if (month == null) {
      return params;
    }
    return Object.assign({}, params, { month });
  }

  getAccounts(route: ActivatedRoute): number[] {
    const accounts = route.snapshot.queryParamMap.get('accounts');
    if (accounts == null) {
      return [];
    }
    return accounts
      .split(',')
      .map(a => +a);
  }

  setAccounts(accounts: number[] | undefined, params: Params): Params {
    if (accounts == null || accounts.length === 0) {
      return params;
    }
    const accountParam = accounts.join(',');
    return Object.assign({}, params, { accounts: accountParam });
  }

  getLabels(route: ActivatedRoute): number[] {
    const labels = route.snapshot.queryParamMap.get('labels');
    if (labels == null) {
      return [];
    }
    return labels
      .split(',')
      .map(a => +a);
  }

  setLabels(labels: number[] | undefined, params: Params): Params {
    if (labels == null || labels.length === 0) {
      return params;
    }
    const labelParam = labels.join(',');
    return Object.assign({}, params, { labels: labelParam });
  }

}
