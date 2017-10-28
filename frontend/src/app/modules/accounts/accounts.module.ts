import {NgModule} from '@angular/core';
import {AccountsService} from './accounts.service';
import {AccountCardComponent} from './account-card.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    AccountCardComponent
  ],
  exports: [
    AccountCardComponent
  ],
  providers: [
    AccountsService
  ],
  imports: [
    SharedModule
  ]
})
export class AccountsModule {
}
