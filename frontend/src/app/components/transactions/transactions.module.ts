import { NgModule } from '@angular/core';
import { LabelToggleComponent } from './label-toggle.component';
import { TransactionsTableComponent } from './transactions-table.component';
import { TransactionsFormComponent } from './transactions-form.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    LabelToggleComponent,
    TransactionsTableComponent,
    TransactionsFormComponent,
  ],
  exports: [
    LabelToggleComponent,
    TransactionsTableComponent,
    TransactionsFormComponent
  ],
  imports: [
    SharedModule
  ]
})
export class TransactionsModule {
}
