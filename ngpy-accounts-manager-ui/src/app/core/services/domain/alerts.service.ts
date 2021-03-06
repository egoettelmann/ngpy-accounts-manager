import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { TransactionsRestService } from '../rest/transactions-rest.service';
import { map } from 'rxjs/operators';
import { FilterOperator, FilterRequest } from '../../models/rql.models';
import { Alerts } from '../../models/domain.models';

/**
 * The alerts service
 */
@Injectable()
export class AlertsService {

  /**
   * Instantiates the service.
   *
   * @param transactionsRestService the transactions rest service
   */
  constructor(private transactionsRestService: TransactionsRestService) {}

  /**
   * Force the loading of the alerts
   */
  getAlerts(): Observable<Alerts> {
    return combineLatest([
      this.countUnlabeled(),
      this.countWronglyCategorizedCredits(),
      this.countWronglyCategorizedDebits()
    ]).pipe(
      map(([labelErrors, creditErrors, debitErrors]) => {
        return {
          labels: labelErrors,
          credits: creditErrors,
          debits: debitErrors,
        };
      })
    );
  }

  /**
   * Counts the number of unlabeled transactions.
   */
  private countUnlabeled(): Observable<number> {
    return this.transactionsRestService.countAll(
      FilterRequest.of('labelId', null, FilterOperator.EQ),
    );
  }

  /**
   * Counts the number of wrongly categorized labels.
   * Returns -1 if there are more than the maximum retrievable entries.
   */
  private countWronglyCategorizedCredits(): Observable<number> {
    const wrongCredits = FilterRequest.all(
      FilterRequest.of('categoryType', 'D', FilterOperator.EQ),
      FilterRequest.of('amount', 0, FilterOperator.GT)
    );
    return this.transactionsRestService.countAll(wrongCredits);
  }

  /**
   * Counts the number of wrongly categorized labels.
   * Returns -1 if there are more than the maximum retrievable entries.
   */
  private countWronglyCategorizedDebits(): Observable<number> {
    const wrongDebits = FilterRequest.all(
      FilterRequest.of('categoryType', 'C', FilterOperator.EQ),
      FilterRequest.of('amount', 0, FilterOperator.LT)
    );
    return this.transactionsRestService.countAll(wrongDebits);
  }

}
