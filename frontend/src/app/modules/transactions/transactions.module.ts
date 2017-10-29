import {NgModule} from '@angular/core';
import {TransactionsTableComponent} from './transactions-table.component';
import {TransactionsService} from './transactions.service';
import {SharedModule} from '../shared/shared.module';
import {StatisticsModule} from '../statistics/statistics.module';

@NgModule({
  declarations: [
    TransactionsTableComponent
  ],
  exports: [
    TransactionsTableComponent,
  ],
  providers: [
    TransactionsService
  ],
  imports: [
    StatisticsModule,
    SharedModule
  ]
})
export class TransactionsModule {
}
