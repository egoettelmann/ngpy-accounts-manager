import { TransactionsViewComponent } from './transactions-view.component';
import { RouterModule, Routes } from '@angular/router';

export const ROUTES: Routes = [
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

export const TransactionsViewRoutes = RouterModule.forChild(ROUTES);
