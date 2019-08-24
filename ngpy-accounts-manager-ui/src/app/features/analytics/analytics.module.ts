import { NgModule } from '@angular/core';

import { AnalyticsComponent } from './views/analytics.component';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AnalyticsQuarterlyChartComponent } from './components/analytics-quarterly-chart/analytics-quarterly-chart.component';
import { AnalyticsDetailsChartComponent } from './components/analytics-details-chart/analytics-details-chart.component';
import { AnalyticsDetailsTableComponent } from './components/analytics-details-table/analytics-details-table.component';

@NgModule({
  declarations: [
    AnalyticsComponent,
    AnalyticsDetailsChartComponent,
    AnalyticsDetailsTableComponent,
    AnalyticsQuarterlyChartComponent
  ],
  imports: [
    SharedModule,
    AnalyticsRoutingModule
  ]
})
export class AnalyticsModule {
}
