import { NgModule } from '@angular/core';
import { TransactionsViewComponent } from './views/transactions-view.component';
import { TransactionsViewRoutingModule } from './transactions-view-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    TransactionsViewComponent,
  ],
  imports: [
    SharedModule,
    TransactionsViewRoutingModule
  ]
})
export class TransactionsViewModule {
}
