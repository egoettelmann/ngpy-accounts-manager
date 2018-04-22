import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {StatisticsService} from './statistics.service';
import {SummaryComponent} from './summary.component';
import { ClarityModule } from 'clarity-angular';

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
    SharedModule,
    ClarityModule.forChild()
  ]
})
export class StatisticsModule {
}
