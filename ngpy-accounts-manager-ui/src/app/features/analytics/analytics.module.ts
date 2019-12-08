import { NgModule } from '@angular/core';

import { AnalyticsComponent } from './views/analytics.component';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AnalyticsBarChartComponent } from './components/bar-chart/analytics-bar-chart.component';
import { AnalyticsPieChartComponent } from './components/pie-chart/analytics-pie-chart.component';
import { AnalyticsDetailsTableComponent } from './components/details-table/analytics-details-table.component';

@NgModule({
  declarations: [
    AnalyticsComponent,
    AnalyticsPieChartComponent,
    AnalyticsDetailsTableComponent,
    AnalyticsBarChartComponent
  ],
  imports: [
    SharedModule,
    AnalyticsRoutingModule
  ]
})
export class AnalyticsModule {
}
