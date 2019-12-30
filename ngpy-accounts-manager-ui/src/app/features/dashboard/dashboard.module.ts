import { NgModule } from '@angular/core';

import { DashboardView } from './views/dashboard.view';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { DashboardAccountsChartComponent } from './components/accounts-chart/dashboard-accounts-chart.component';
import { DashboardAccountCardComponent } from './components/account-card/dashboard-account-card.component';
import { DashboardAlertsComponent } from './components/alerts/dashboard-alerts.component';
import { DashboardTotalSummaryComponent } from './components/total-summary/dashboard-total-summary.component';

@NgModule({
  declarations: [
    DashboardView,
    DashboardAccountCardComponent,
    DashboardAccountsChartComponent,
    DashboardAlertsComponent,
    DashboardTotalSummaryComponent
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule {
}
