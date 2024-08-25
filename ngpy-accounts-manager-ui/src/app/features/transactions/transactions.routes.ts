import { TransactionsView } from './views/transactions.view';
import { Routes } from '@angular/router';
import { TransactionsListView } from './views/list/transactions-list.view';
import { TransactionsSearchView } from './views/search/transactions-search.view';

export const transactionsRoutes: Routes = [
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
