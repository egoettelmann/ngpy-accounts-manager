import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, zip } from 'rxjs';
import { TransactionsRestService } from '../rest/transactions-rest.service';
import { map, skip } from 'rxjs/operators';
import { FilterOperator, FilterRequest } from '../../models/rql.models';
import { Alerts } from '../../models/domain.models';

@Injectable()
export class AlertsService {

  private subject = new BehaviorSubject<Alerts>(undefined);

  constructor(private transactionsRestService: TransactionsRestService) {}

  /**
   * The alert changes triggered each time the alerts are reloaded.
   */
  get alertChanges(): Observable<Alerts> {
    if (this.subject.getValue() === undefined) {
      this.getAlerts().subscribe(alerts => {
        this.subject.next(alerts);
      });
    }
    return this.subject.asObservable().pipe(
      skip(1)
    );
  }

  /**
   * Force the loading of the alerts
   */
  getAlerts(): Observable<Alerts> {
    return zip(
      this.countUnlabeled(),
      this.countWronglyCategorizedCredits(),
      this.countWronglyCategorizedDebits()
    ).pipe(
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
