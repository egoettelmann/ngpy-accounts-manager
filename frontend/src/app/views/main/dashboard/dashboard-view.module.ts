import { NgModule } from '@angular/core';

import { DashboardViewComponent } from './dashboard-view.component';
import { DashboardViewRoutes } from './dashboard-view.routes';
import { SharedModule } from '../../../components/shared/shared.module';
import { AccountsModule } from '../../../components/accounts/accounts.module';

@NgModule({
  declarations: [
    DashboardViewComponent,
  ],
  imports: [
    SharedModule,
    AccountsModule,
    DashboardViewRoutes
  ]
})
export class DashboardViewModule {
}
