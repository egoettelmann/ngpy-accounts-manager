import { NgModule } from '@angular/core';
import { TransactionsComponent } from './views/transactions.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    TransactionsComponent,
  ],
  imports: [
    SharedModule,
    TransactionsRoutingModule
  ]
})
export class TransactionsModule {
}
