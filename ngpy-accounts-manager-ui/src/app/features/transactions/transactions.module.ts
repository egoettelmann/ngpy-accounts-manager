import { NgModule } from '@angular/core';
import { TransactionsComponent } from './views/transactions.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { TransactionsSearchFormComponent } from './components/search-form/transactions-search-form.component';
import { TransactionsSearchComponent } from './views/search/transactions-search.component';
import { TransactionsListComponent } from './views/list/transactions-list.component';

@NgModule({
  declarations: [
    TransactionsComponent,
    TransactionsListComponent,
    TransactionsSearchFormComponent,
    TransactionsSearchComponent,
  ],
  imports: [
    SharedModule,
    TransactionsRoutingModule
  ]
})
export class TransactionsModule {
}
