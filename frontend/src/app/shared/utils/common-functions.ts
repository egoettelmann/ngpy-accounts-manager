import { FilterCriteria, PageRequest } from '../../core/models/api.models';
import { HttpParams } from '@angular/common/http';

export class CommonFunctions {

  /**
   * Builds HttpParams from a provided filter criteria and page request.
   *
   * @param filterCriteria the filter criteria
   * @param pageRequest the page request
   */
  public static buildHttpParams(filterCriteria?: FilterCriteria, pageRequest?: PageRequest): HttpParams {
    let params = new HttpParams();

    // Adding the filter criteria
    if (filterCriteria != null) {
      if (filterCriteria.accountIds !== undefined) {
        params.append('account_ids', filterCriteria.accountIds.join(','));
      }
      if (filterCriteria.dateFrom !== undefined) {
        params = params.append('from', CommonFunctions.formatDate(filterCriteria.dateFrom));
      }
      if (filterCriteria.dateTo !== undefined) {
        params = params.append('to', CommonFunctions.formatDate(filterCriteria.dateTo));
      }
      if (filterCriteria.labelIds !== undefined) {
        params = params.append('label_ids', filterCriteria.labelIds.join(','));
      }
      if (filterCriteria.categoryType != null) {
        params = params.append('category_type', filterCriteria.categoryType);
      }
      if (filterCriteria.reference != null) {
        params = params.append('reference', filterCriteria.reference);
      }
      if (filterCriteria.description != null) {
        params = params.append('description', filterCriteria.description);
      }
      if (filterCriteria.min != null) {
        params = params.append('min', filterCriteria.min.toString());
      }
      if (filterCriteria.max != null) {
        params = params.append('max', filterCriteria.max.toString());
      }
    }

    // Adding the page request
    if (pageRequest != null) {
      if (pageRequest.page != null) {
        params = params.append('page', pageRequest.page.toString());
        if (pageRequest.pageSize != null) {
          params = params.append('page_size', pageRequest.pageSize.toString());
        }
      }
      if (pageRequest.sort != null) {
        params = params.append('sort', pageRequest.sort);
        if (pageRequest.sortDirection != null) {
          params = params.append('sort_direction', pageRequest.sortDirection);
        }
      }
    }

    return params;
  }

  /**
   * Formats a date as string.
   *
   * @param date the date to format
   */
  public static formatDate(date: Date): string {
    return ''
      + date.getFullYear()
      + '-'
      + ('0' + (date.getMonth() + 1)).slice(-2)
      + '-'
      + ('0' + date.getDate()).slice(-2)
      + '';
  }

  /**
   * Get the list of months.
   *
   * @returns {number[]} the list of months starting at 1
   */
  public static getMonthsList(): number[] {
    return Array.from(Array(12)).map((e, i) => i + 1);
  }

  /**
   * Gets a list of years from a given start year to the current year.
   *
   * @param {number} startYear the year to start from
   * @returns {number[]} the list of years in descending order
   */
  public static getYearsList(startYear = 2014): number[] {
    return Array.from(Array(CommonFunctions.getCurrentYear() - startYear + 1))
      .map((e, i) => i + startYear)
      .reverse();
  }

  /**
   * Gets the current year.
   *
   * @returns {number} the current year
   */
  public static getCurrentYear(): number {
    return new Date().getFullYear();
  }

  /**
   * Gets the current months (with January = 1).
   *
   * @returns {number} the current month
   */
  public static getCurrentMonth(): number {
    return new Date().getMonth() + 1;
  }

  /**
   * Resizes an array.
   *
   * @param {number[]} arrayToResize the array to resize
   * @param {number} placeholder the placeholder to set for new values
   * @param {number} maxSize the max size of the array
   */
  public static resizeArray(arrayToResize: number[], placeholder: number, maxSize: number) {
    for (let i = arrayToResize.length; i <= maxSize; i++) {
      arrayToResize[i] = placeholder;
    }
  }

  public static removeEmpty(obj: any): any {
    if (Array.isArray(obj)) {
      return obj
        .filter(f => f != null)
        .map((r, i) =>
          CommonFunctions.removeEmpty(r)
        );
    } else if (typeof obj !== 'object') {
      return obj;
    } else {
      return Object.keys(obj)
        .filter(f => obj[f] != null)
        .reduce(
          (r, i) => {
            return {...r, [i]: CommonFunctions.removeEmpty(obj[i])};
          },
          {}
        );
    }
  }

}
