import {NgModule} from '@angular/core';
import {TransactionsTableComponent} from './transactions-table.component';
import {TransactionsService} from './transactions.service';
import {SharedModule} from '../shared/shared.module';

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
    SharedModule
  ]
})
export class TransactionsModule {
}
