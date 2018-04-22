import { NgModule } from '@angular/core';
import { AccountsService } from './accounts.service';
import { AccountCardComponent } from './account-card.component';
import { AccountToggleComponent } from './account-toggle.component';
import { SharedModule } from '../shared/shared.module';
import { ClarityModule } from 'clarity-angular';

@NgModule({
  declarations: [
    AccountCardComponent,
    AccountToggleComponent
  ],
  exports: [
    AccountCardComponent,
    AccountToggleComponent
  ],
  providers: [
    AccountsService
  ],
  imports: [
    SharedModule,
    ClarityModule.forChild()
  ]
})
export class AccountsModule {
}
