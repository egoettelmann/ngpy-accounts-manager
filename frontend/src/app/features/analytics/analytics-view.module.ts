import { NgModule } from '@angular/core';

import { AnalyticsViewComponent } from './views/analytics-view.component';
import { AnalyticsViewRoutingModule } from './analytics-view-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    AnalyticsViewComponent,
  ],
  imports: [
    SharedModule,
    AnalyticsViewRoutingModule
  ]
})
export class AnalyticsViewModule {
}
