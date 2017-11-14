import {NgModule} from '@angular/core';
import {TransactionsTableComponent} from './transactions-table.component';
import {TransactionsService} from './transactions.service';
import {SharedModule} from '../shared/shared.module';
import {StatisticsModule} from '../statistics/statistics.module';
import {TransactionsFormComponent} from './transactions-form.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    TransactionsTableComponent,
    TransactionsFormComponent
  ],
  exports: [
    TransactionsTableComponent,
    TransactionsFormComponent
  ],
  providers: [
    TransactionsService
  ],
  imports: [
    StatisticsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class TransactionsModule {
}
