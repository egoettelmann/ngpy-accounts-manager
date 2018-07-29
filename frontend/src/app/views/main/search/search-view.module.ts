import { NgModule } from '@angular/core';

import { SearchViewComponent } from './search-view.component';
import { SearchViewRoutes } from './search-view.routes';
import { SharedModule } from '../../../components/shared/shared.module';
import { TransactionsModule } from '../../../components/transactions/transactions.module';
import { AccountsModule } from '../../../components/accounts/accounts.module';

@NgModule({
  declarations: [
    SearchViewComponent,
  ],
  imports: [
    SharedModule,
    AccountsModule,
    TransactionsModule,
    SearchViewRoutes
  ]
})
export class SearchViewModule {
}
