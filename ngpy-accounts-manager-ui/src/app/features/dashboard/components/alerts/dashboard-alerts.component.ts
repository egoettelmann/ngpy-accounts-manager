import { Component, Input } from '@angular/core';
import { Alerts } from '@core/models/domain.models';
import { Category } from '@core/models/api.models';
import { RouterService } from '@core/services/router.service';

@Component({
  selector: 'app-dashboard-alerts',
  templateUrl: './dashboard-alerts.component.html',
  styleUrls: ['./dashboard-alerts.component.scss']
})
export class DashboardAlertsComponent {

  /**
   * The alerts
   */
  @Input() alerts?: Alerts;

  /**
   * The credit categories
   */
  @Input() creditCategories?: Category[];

  /**
   * The debit categories
   */
  @Input() debitCategories?: Category[];

  /**
   * Instantiates the component.
   *
   * @param routerService the router service
   */
  constructor(private routerService: RouterService) {
  }

  /**
   * Redirects to the label alerts view
   */
  goToLabelAlerts(): void {
    this.routerService.navigate('route.transactions.search', {}, {
      queryParams: {
        labels: ''
      }
    });
  }

  /**
   * Redirects to the credit category alerts view
   */
  goToCategoryCreditAlerts(): void {
    if (this.debitCategories == null) {
      return;
    }
    this.routerService.navigate('route.transactions.search', {}, {
      queryParams: {
        categories: this.debitCategories.map(c => c.id).join(','),
        minAmount: 0
      }
    });
  }

  /**
   * Redirects to the debit category alerts view
   */
  goToCategoryDebitAlerts(): void {
    if (this.creditCategories == null) {
      return;
    }
    this.routerService.navigate('route.transactions.search', {}, {
      queryParams: {
        categories: this.creditCategories.map(c => c.id).join(','),
        maxAmount: 0
      }
    });
  }

}
