import { NgModule } from '@angular/core';

import { DashboardComponent } from './views/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { DashboardAccountsChartComponent } from './components/dashboard-accounts-chart/dashboard-accounts-chart.component';
import { DashboardAccountsCardComponent } from './components/dashboard-accounts-card/dashboard-accounts-card.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardAccountsCardComponent,
    DashboardAccountsChartComponent
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule {
}