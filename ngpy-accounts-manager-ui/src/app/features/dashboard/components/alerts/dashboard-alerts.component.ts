import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Alerts } from '../../../../core/models/domain.models';
import { Category } from '../../../../core/models/api.models';

@Component({
  selector: 'app-dashboard-alerts',
  templateUrl: './dashboard-alerts.component.html',
  styleUrls: ['./dashboard-alerts.component.scss']
})
export class DashboardAlertsComponent {

  /**
   * The alerts
   */
  @Input() alerts: Alerts;

  /**
   * The credit categories
   */
  @Input() creditCategories: Category[];

  /**
   * The debit categories
   */
  @Input() debitCategories: Category[];

  /**
   * Instantiates the component.
   *
   * @param router the router
   */
  constructor(private router: Router) {
  }

  /**
   * Redirects to the label alerts view
   */
  goToLabelAlerts() {
    this.router.navigate(['transactions', 'search'], {
      queryParams: {
        labels: ''
      }
    });
  }

  /**
   * Redirects to the credit category alerts view
   */
  goToCategoryCreditAlerts() {
    this.router.navigate(['transactions', 'search'], {
      queryParams: {
        categories: this.debitCategories.map(c => c.id).join(','),
        minAmount: 0
      }
    });
  }

  /**
   * Redirects to the debit category alerts view
   */
  goToCategoryDebitAlerts() {
    this.router.navigate(['transactions', 'search'], {
      queryParams: {
        categories: this.creditCategories.map(c => c.id).join(','),
        maxAmount: 0
      }
    });
  }

}
