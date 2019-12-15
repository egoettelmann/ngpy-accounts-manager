import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { DateService } from './date.service';
import { Location } from '@angular/common';
import { RouterPathPipe } from '../../shared/modules/router-path/router-path.pipe';

/**
 * The Router service
 */
@Injectable()
export class RouterService {

  constructor(private router: Router,
              private routerPathPipe: RouterPathPipe,
              private location: Location,
              private dateService: DateService
  ) {}

  navigate(routeKey: string, pathVariables?: {[key: string]: any}, extras?: NavigationExtras) {
    const routePath = this.routerPathPipe.transform(routeKey, pathVariables);
    this.router.navigate(routePath, extras);
  }

  refresh(commands: any[], queryParams: Params) {
    const url = this.router.createUrlTree(commands, {
      queryParams: queryParams
    }).toString();
    this.location.go(url);
  }

  getYear(route: ActivatedRoute): number {
    if (!route.snapshot.queryParamMap.has('year')) {
      return this.dateService.getCurrentYear();
    }
    return +route.snapshot.queryParamMap.get('year');
  }

  setYear(year: number, params: Params): Params {
    if (year == null) {
      return params;
    }
    return Object.assign({}, params, { 'year': year });
  }

  getMonth(route: ActivatedRoute): number {
    if (!route.snapshot.queryParamMap.has('month')) {
      return this.dateService.getCurrentMonth();
    }
    return +route.snapshot.queryParamMap.get('month');
  }

  setMonth(month: number, params: Params): Params {
    if (month == null) {
      return params;
    }
    return Object.assign({}, params, { 'month': month });
  }

  getAccounts(route: ActivatedRoute): number[] {
    if (!route.snapshot.queryParamMap.has('accounts')) {
      return [];
    }
    return route.snapshot.queryParamMap.get('accounts')
      .split(',')
      .map(a => +a);
  }

  setAccounts(accounts: number[], params: Params): Params {
    if (accounts == null || accounts.length === 0) {
      return params;
    }
    const accountParam = accounts.join(',');
    return Object.assign({}, params, { 'accounts': accountParam });
  }

  getLabels(route: ActivatedRoute): number[] {
    if (!route.snapshot.queryParamMap.has('labels')) {
      return [];
    }
    return route.snapshot.queryParamMap.get('labels')
      .split(',')
      .map(a => +a);
  }

  setLabels(labels: number[], params: Params): Params {
    if (labels == null || labels.length === 0) {
      return params;
    }
    const labelParam = labels.join(',');
    return Object.assign({}, params, { 'labels': labelParam });
  }

}
