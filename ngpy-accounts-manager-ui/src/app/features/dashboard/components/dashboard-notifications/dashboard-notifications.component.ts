import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Alerts } from '../../../../core/models/domain.models';

@Component({
  selector: 'app-dashboard-notifications',
  templateUrl: './dashboard-notifications.component.html',
  styleUrls: ['./dashboard-notifications.component.scss']
})
export class DashboardNotificationsComponent {

  @Input() alerts: Alerts;

  constructor(private router: Router) {
  }

  goToLabelAlerts() {
    this.router.navigate(['search'], {
      queryParams: {
        labels: ''
      }
    });
  }

  goToCategoryCreditAlerts() {
    this.router.navigate(['search'], {
      queryParams: {
        categories: '2,3,5',
        minAmount: 0
      }
    });
  }

  goToCategoryDebitAlerts() {
    this.router.navigate(['search'], {
      queryParams: {
        categories: '1,4',
        maxAmount: 0
      }
    });
  }

}
