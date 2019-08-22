import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompositeKeyValue, KeyValue, Summary } from '../../models/api.models';
import { Observable } from 'rxjs';
import { RqlService } from '../rql.service';
import { FilterRequest } from '../../models/rql.models';
import { DateService } from '../date.service';

/**
 * The statistics rest service
 */
@Injectable()
export class StatisticsRestService {

  /**
   * Instantiates the service.
   *
   * @param http the HTTP client
   * @param dateService the date service
   * @param rqlService the RQL service
   */
  constructor(private http: HttpClient,
              private dateService: DateService,
              private rqlService: RqlService
  ) {}

  /**
   * Gets the repartition for a provided filter request.
   *
   * @param filterRequest the filter request
   */
  getRepartition(filterRequest: FilterRequest): Observable<KeyValue[]> {
    const params = this.rqlService.buildHttpParamsFromFilter(filterRequest);
    return this.http.get<KeyValue[]>('/rest/stats/repartition', {params: params});
  }

  /**
   * Gets the evolution.
   *
   * @param period the period
   * @param dateFrom the date from
   * @param dateTo the date to
   * @param accounts the list of accounts
   * @param filterRequest the filter request
   */
  getEvolution(period: string, dateFrom: Date, dateTo: Date, accounts: number[], filterRequest: FilterRequest): Observable<KeyValue[]> {
    let params = new HttpParams();

    // Adding from date
    const startDate = this.dateService.format(dateFrom);
    const endDate = this.dateService.format(dateTo);
    params = params.set('date_from', startDate);
    params = params.set('date_to', endDate);

    // Adding period
    params = params.set('period', period);

    // Adding accounts
    if (accounts != null) {
      params = params.append('account_ids', accounts.join(','));
    }

    // Adding additional filters
    params = this.rqlService.buildHttpParamsFromFilter(filterRequest, params);

    return this.http.get<KeyValue[]>('/rest/stats/evolution', {params: params});
  }

  /**
   * Gets the aggregation.
   *
   * @param period the period
   * @param filterRequest the filter request
   */
  getAggregation(period: string, filterRequest: FilterRequest): Observable<KeyValue[]> {
    let params = this.rqlService.buildHttpParamsFromFilter(filterRequest);
    params = params.set('period', period);
    return this.http.get<any>('/rest/stats/aggregation', {params: params});
  }

  /**
   * Gets the summary.
   *
   * @param dateFrom the date from
   * @param dateTo the date to
   * @param accounts the list of accounts
   * @param filterRequest the filter request
   */
  getSummary(dateFrom: Date, dateTo: Date, accounts: number[], filterRequest: FilterRequest): Observable<Summary> {
    let params = new HttpParams();

    // Adding from date
    const startDate = this.dateService.format(dateFrom);
    const endDate = this.dateService.format(dateTo);
    params = params.set('date_from', startDate);
    params = params.set('date_to', endDate);

    // Adding accounts
    if (accounts != null) {
      params = params.append('account_ids', accounts.join(','));
    }

    // Adding additional filters
    params = this.rqlService.buildHttpParamsFromFilter(filterRequest, params);

    return this.http.get<any>('/rest/stats/summary', {params: params});
  }

  /**
   * Gets the analytics.
   *
   * @param period the period
   * @param filterRequest the filter request
   */
  getAnalytics(period: string, filterRequest: FilterRequest): Observable<CompositeKeyValue[]> {
    let params = this.rqlService.buildHttpParamsFromFilter(filterRequest);
    params = params.set('period', period);
    return this.http.get<CompositeKeyValue[]>('/rest/stats/analytics', {params: params});
  }

  /**
   * Gets the analytics details.
   *
   * @param filterRequest the filter request
   */
  getAnalyticsDetails(filterRequest: FilterRequest): Observable<CompositeKeyValue[]> {
    const params = this.rqlService.buildHttpParamsFromFilter(filterRequest);
    return this.http.get<CompositeKeyValue[]>('/rest/stats/analytics/details', {params: params});
  }

}
