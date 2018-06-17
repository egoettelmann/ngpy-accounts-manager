import { NgModule } from '@angular/core';
import { TransactionsViewComponent } from './transactions-view.component';
import { TransactionsViewRoutes } from './transactions-view.routes';
import { SharedModule } from '../../../components/shared/shared.module';
import { AccountsModule } from '../../../components/accounts/accounts.module';
import { StatisticsModule } from '../../../components/statistics/statistics.module';
import { TransactionsModule } from '../../../components/transactions/transactions.module';

@NgModule({
  declarations: [
    TransactionsViewComponent,
  ],
  imports: [
    SharedModule,
    AccountsModule,
    StatisticsModule,
    TransactionsModule,
    TransactionsViewRoutes
  ]
})
export class TransactionsViewModule {
}
