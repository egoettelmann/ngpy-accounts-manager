import { NgModule } from '@angular/core';

import { AnalyticsComponent } from './views/analytics.component';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AnalyticsChartComponent } from './components/analytics-chart/analytics-chart.component';

@NgModule({
  declarations: [
    AnalyticsComponent,
    AnalyticsChartComponent
  ],
  imports: [
    SharedModule,
    AnalyticsRoutingModule
  ]
})
export class AnalyticsModule {
}
