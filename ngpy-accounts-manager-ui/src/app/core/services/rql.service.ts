import { Injectable } from '@angular/core';
import { FilterRequest, PageRequest, SearchRequest, SortRequest } from '../models/rql.models';
import { HttpParams } from '@angular/common/http';

/**
 * The RQL service
 */
@Injectable()
export class RqlService {

  private static readonly SORT_ATTRIBUTE = 'sort';
  private static readonly SORT_DIRECTION_ATTRIBUTE = 'sort_direction';
  private static readonly PAGE_ATTRIBUTE = 'page';
  private static readonly PAGE_SIZE_ATTRIBUTE = 'page_size';
  private static readonly RQL_ATTRIBUTE = 'rql';

  /**
   * Builds HttpParams from a provided search request object.
   *
   * @param searchRequest the search request
   * @param httpParams the optional already existing HttpParams
   */
  buildHttpParams(searchRequest: SearchRequest, httpParams?: HttpParams): HttpParams {
    if (!httpParams) {
      httpParams = new HttpParams();
    }

    // Adding the sort request
    httpParams = this.buildHttpParamsFromSort(searchRequest.sort, httpParams);

    // Adding the page request
    httpParams = this.buildHttpParamsFromPage(searchRequest.page, httpParams);

    // Adding the filter request
    httpParams = this.buildHttpParamsFromFilter(searchRequest.filter, httpParams);

    return httpParams;
  }

  /**
   * Builds HttpParams from a sort request.
   *
   * @param sortRequest the sort request
   * @param httpParams the optional http params
   */
  public buildHttpParamsFromSort(sortRequest: SortRequest, httpParams?: HttpParams): HttpParams {
    // Building new http params if undefined
    if (!httpParams) {
      httpParams = new HttpParams();
    }

    // Adding the sort attribute
    if (!sortRequest) {
      return httpParams;
    }
    httpParams = httpParams.set(RqlService.SORT_ATTRIBUTE, sortRequest.sort);

    // Adding the sort direction attribute
    if (!sortRequest.sortDirection) {
      return httpParams;
    }
    httpParams = httpParams.set(RqlService.SORT_DIRECTION_ATTRIBUTE, sortRequest.sortDirection);

    // Done
    return httpParams;
  }

  /**
   * Builds HttpParams from a page request.
   *
   * @param pageRequest the page request
   * @param httpParams the optional http params
   */
  public buildHttpParamsFromPage(pageRequest: PageRequest, httpParams?: HttpParams): HttpParams {
    // Building new http params if undefined
    if (!httpParams) {
      httpParams = new HttpParams();
    }

    // Adding the page attribute
    if (!pageRequest) {
      return httpParams;
    }
    httpParams = httpParams.set(RqlService.PAGE_ATTRIBUTE, pageRequest.page.toString());

    // Adding the page size attribute
    if (!pageRequest.pageSize) {
      return httpParams;
    }
    httpParams = httpParams.set(RqlService.PAGE_SIZE_ATTRIBUTE, pageRequest.pageSize.toString());

    // Done
    return httpParams;
  }

  /**
   * Builds HttpParams from a filter request.
   *
   * @param filterRequest the filter request
   * @param httpParams the optional http params
   */
  public buildHttpParamsFromFilter(filterRequest: FilterRequest, httpParams?: HttpParams): HttpParams {
    // Building new http params if undefined
    if (!httpParams) {
      httpParams = new HttpParams();
    }

    // Adding the rql attribute
    if (!filterRequest) {
      return httpParams;
    }
    httpParams = httpParams.set(RqlService.RQL_ATTRIBUTE, filterRequest.toString());

    // Done
    return httpParams;
  }

  /**
   * Formats a list to a string.
   *
   * @param list the list to format
   */
  public formatList(list: any[]): string {
    return '[' + list.join(',') + ']';
  }

}
