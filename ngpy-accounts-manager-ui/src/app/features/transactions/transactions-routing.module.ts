import { TransactionsComponent } from './views/transactions.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TransactionsListComponent } from './views/list/transactions-list.component';
import { TransactionsSearchComponent } from './views/search/transactions-search.component';

export const routes: Routes = [
  {
    path: '',
    component: TransactionsComponent,
    children: [
      {
        path: '',
        component: TransactionsListComponent
      },
      {
        path: 'search',
        component: TransactionsSearchComponent
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
