import { NgModule } from '@angular/core';
import { TransactionsView } from './views/transactions.view';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { TransactionsSearchFormComponent } from './components/search-form/transactions-search-form.component';
import { TransactionsSearchView } from './views/search/transactions-search.view';
import { TransactionsListView } from './views/list/transactions-list.view';

@NgModule({
  declarations: [
    TransactionsView,
    TransactionsListView,
    TransactionsSearchFormComponent,
    TransactionsSearchView
  ],
  imports: [
    SharedModule,
    TransactionsRoutingModule
  ]
})
export class TransactionsModule {
}
