import { TransactionsView } from './views/transactions.view';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TransactionsListView } from './views/list/transactions-list.view';
import { TransactionsSearchView } from './views/search/transactions-search.view';

export const routes: Routes = [
  {
    path: '',
    component: TransactionsView,
    children: [
      {
        path: '',
        component: TransactionsListView
      },
      {
        path: 'search',
        component: TransactionsSearchView
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class TransactionsRoutingModule {

}
