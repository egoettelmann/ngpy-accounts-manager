import { NgModule } from '@angular/core';

import { AnalyticsComponent } from './views/analytics.component';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    AnalyticsComponent,
  ],
  imports: [
    SharedModule,
    AnalyticsRoutingModule
  ]
})
export class AnalyticsModule {
}
