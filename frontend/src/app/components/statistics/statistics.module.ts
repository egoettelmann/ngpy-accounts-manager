import { NgModule } from '@angular/core';
import { SummaryComponent } from './summary.component';
import { GroupedDetailsTableComponent } from './grouped-details-table.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    SummaryComponent,
    GroupedDetailsTableComponent
  ],
  exports: [
    SummaryComponent,
    GroupedDetailsTableComponent
  ],
  imports: [
    SharedModule
  ]
})
export class StatisticsModule {
}
