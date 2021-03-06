/**
 * The sort request
 */
export class SortRequest {
  sort: string;
  sortDirection?: 'ASC' | 'DESC';
}

/**
 * The page request
 */
export class PageRequest {
  page: number;
  pageSize?: number;
}

/**
 * The filter operators
 */
export enum FilterOperator {
  EQ = 'eq',
  NE = 'ne',
  IN = 'in',
  NI = 'ni',
  GT = 'gt',
  LT = 'lt',
  GE = 'ge',
  LE = 'le',
  CT = 'ct',
}

/**
 * The filter request
 */
export class FilterRequest {
  operator: FilterOperator;
  field: string;
  value: string | number | boolean;
  collection: FilterRequest[];
  isAnd: boolean;

  /**
   * The constructor is private to prevent instantiating it directly.
   */
  private constructor() {}

  /**
   * Builds a simple filter request element with a field, value and an operator.
   *
   * @param field the field to filter on
   * @param value the value to filter
   * @param operator the operator to apply as filter
   */
  static of(field: string, value: string | number | boolean, operator: FilterOperator): FilterRequest {
    const filterRequest = new FilterRequest();
    filterRequest.field = field;
    filterRequest.value = value;
    filterRequest.operator = operator;
    return filterRequest;
  }

  /**
   * Aggregates multiple filter requests into one with an 'and' condition.
   *
   * @param filters the list of filters to aggregate
   */
  static all(...filters: FilterRequest[]): FilterRequest {
    if (filters.length === 1) {
      const item = filters[0];
      return FilterRequest.of(item.field, item.value, item.operator);
    }
    const filterRequest = new FilterRequest();
    filterRequest.isAnd = true;
    filterRequest.collection = [];
    filters.forEach(f => {
      // Same type collections are flattened
      if (f.isCollection() && f.isAnd) {
        filterRequest.collection.push(...f.collection);
      } else {
        filterRequest.collection.push(f);
      }
    });
    return filterRequest;
  }

  /**
   * Aggregates multiple filter requests into one with an 'or' condition.
   *
   * @param filters the list of filters to aggregate
   */
  static either(...filters: FilterRequest[]): FilterRequest {
    if (filters.length === 1) {
      const item = filters[0];
      return FilterRequest.of(item.field, item.value, item.operator);
    }
    const filterRequest = new FilterRequest();
    filterRequest.isAnd = false;
    filterRequest.collection = [];
    filters.forEach(f => {
      // Same type collections are flattened
      if (f.isCollection() && !f.isAnd) {
        filterRequest.collection.push(...f.collection);
      } else {
        filterRequest.collection.push(f);
      }
    });
    return filterRequest;
  }

  /**
   * Checks if it is a collection or not
   */
  isCollection(): boolean {
    return this.collection !== undefined;
  }

  /**
   * Transforms the filter request to an RQL string.
   */
  toString(): string {
    let result = '';
    if (this.isCollection()) {
      if (this.isAnd) {
        result += 'and(';
      } else {
        result += 'or(';
      }
      result += this.collection.map(fr => fr.toString()).join(';');
    } else {
      result += this.operator.toString() + '(';
      result += this.field;
      result += ',';
      result += encodeURIComponent('' + this.value);
    }
    result += ')';
    return result;
  }

}

/**
 * The search request
 */
export class SearchRequest {
  filter?: FilterRequest;
  page?: PageRequest;
  sort?: SortRequest;
}
