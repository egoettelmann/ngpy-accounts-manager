import { TransactionsViewComponent } from './views/transactions-view.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TransactionsViewComponent
      },
      {
        path: ':year/:month',
        component: TransactionsViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class TransactionsViewRoutingModule {

}
