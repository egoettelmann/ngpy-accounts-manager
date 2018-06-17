import { NgModule } from '@angular/core';

import { TreasuryViewComponent } from './treasury-view.component';
import { TreasuryViewRoutes } from './treasury-view.routes';
import { SharedModule } from '../../../components/shared/shared.module';
import { AccountsModule } from '../../../components/accounts/accounts.module';
import { StatisticsModule } from '../../../components/statistics/statistics.module';
import { TransactionsModule } from '../../../components/transactions/transactions.module';

@NgModule({
  declarations: [
    TreasuryViewComponent,
  ],
  imports: [
    SharedModule,
    AccountsModule,
    StatisticsModule,
    TransactionsModule,
    TreasuryViewRoutes
  ]
})
export class TreasuryViewModule {
}
