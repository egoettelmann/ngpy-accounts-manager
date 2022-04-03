import { NgModule } from '@angular/core';

import { AnalyticsView } from './views/analytics.view';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AnalyticsBarChartComponent } from './components/bar-chart/analytics-bar-chart.component';
import { AnalyticsPieChartComponent } from './components/pie-chart/analytics-pie-chart.component';
import { AnalyticsDetailsTableComponent } from './components/details-table/analytics-details-table.component';
import { AnalyticsMovementsTableComponent } from './components/movements-table/analytics-movements-table.component';

@NgModule({
  declarations: [
    AnalyticsView,
    AnalyticsPieChartComponent,
    AnalyticsDetailsTableComponent,
    AnalyticsBarChartComponent,
    AnalyticsMovementsTableComponent
  ],
  imports: [
    SharedModule,
    AnalyticsRoutingModule
  ]
})
export class AnalyticsModule {
}
