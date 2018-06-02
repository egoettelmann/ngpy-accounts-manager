import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {StatisticsService} from './statistics.service';
import {SummaryComponent} from './summary.component';
import { ClarityModule } from 'clarity-angular';
import { GroupedDetailsTableComponent } from './grouped-details-table.component';

@NgModule({
  declarations: [
    SummaryComponent,
    GroupedDetailsTableComponent
  ],
  exports: [
    SummaryComponent,
    GroupedDetailsTableComponent
  ],
  providers: [
    StatisticsService
  ],
  imports: [
    SharedModule,
    ClarityModule.forChild()
  ]
})
export class StatisticsModule {
}
