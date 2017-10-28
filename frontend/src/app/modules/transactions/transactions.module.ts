import {NgModule} from '@angular/core';
import {TransactionsTableComponent} from './transactions-table.component';
import {TransactionsService} from './transactions.service';
import {SharedModule} from '../shared/shared.module';
import {StatisticsService} from '../../statistics.service';

@NgModule({
  declarations: [
    TransactionsTableComponent
  ],
  exports: [
    TransactionsTableComponent,
  ],
  providers: [
    TransactionsService,
    StatisticsService
  ],
  imports: [
    SharedModule
  ]
})
export class TransactionsModule {
}
