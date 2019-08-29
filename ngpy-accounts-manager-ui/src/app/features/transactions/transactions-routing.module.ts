import { TransactionsComponent } from './views/transactions.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TransactionsComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class TransactionsRoutingModule {

}
