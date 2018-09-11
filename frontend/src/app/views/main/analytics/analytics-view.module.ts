import { NgModule } from '@angular/core';

import { AnalyticsViewComponent } from './analytics-view.component';
import { AnalyticsViewRoutes } from './analytics-view.routes';
import { SharedModule } from '../../../components/shared/shared.module';
import { AccountsModule } from '../../../components/accounts/accounts.module';
import { StatisticsModule } from '../../../components/statistics/statistics.module';
import { DatesModule } from '../../../components/dates/dates.module';

@NgModule({
  declarations: [
    AnalyticsViewComponent,
  ],
  imports: [
    SharedModule,
    DatesModule,
    AccountsModule,
    StatisticsModule,
    AnalyticsViewRoutes
  ]
})
export class AnalyticsViewModule {
}
