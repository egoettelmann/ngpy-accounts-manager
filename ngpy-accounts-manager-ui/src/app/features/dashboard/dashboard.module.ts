import { NgModule } from '@angular/core';

import { DashboardComponent } from './views/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { DashboardAccountsChartComponent } from './components/accounts-chart/dashboard-accounts-chart.component';
import { DashboardAccountCardComponent } from './components/account-card/dashboard-account-card.component';
import { DashboardAlertsComponent } from './components/alerts/dashboard-alerts.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardAccountCardComponent,
    DashboardAccountsChartComponent,
    DashboardAlertsComponent
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule {
}
