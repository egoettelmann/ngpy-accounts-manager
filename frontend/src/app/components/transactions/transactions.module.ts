import { NgModule } from '@angular/core';
import { TransactionsTableComponent } from './transactions-table.component';
import { TransactionsFormComponent } from './transactions-form.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    TransactionsTableComponent,
    TransactionsFormComponent,
  ],
  exports: [
    TransactionsTableComponent,
    TransactionsFormComponent
  ],
  imports: [
    SharedModule
  ]
})
export class TransactionsModule {
}
