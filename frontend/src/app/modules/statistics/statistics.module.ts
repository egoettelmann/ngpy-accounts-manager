import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {StatisticsService} from './statistics.service';
import {SummaryComponent} from './summary.component';

@NgModule({
  declarations: [
    SummaryComponent
  ],
  exports: [
    SummaryComponent,
  ],
  providers: [
    StatisticsService
  ],
  imports: [
    SharedModule
  ]
})
export class StatisticsModule {
}
