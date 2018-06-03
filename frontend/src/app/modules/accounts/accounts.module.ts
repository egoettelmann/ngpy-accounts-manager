import { NgModule } from '@angular/core';
import { AccountCardComponent } from './account-card.component';
import { AccountToggleComponent } from './account-toggle.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [
    AccountCardComponent,
    AccountToggleComponent
  ],
  exports: [
    AccountCardComponent,
    AccountToggleComponent
  ],
  imports: [
    SharedModule
  ]
})
export class AccountsModule {
}
