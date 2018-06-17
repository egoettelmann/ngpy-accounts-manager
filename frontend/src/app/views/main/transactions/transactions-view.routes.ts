import { TransactionsViewComponent } from './transactions-view.component';
import { RouterModule, Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: ':year/:month',
    component: TransactionsViewComponent
  }
];

export const TransactionsViewRoutes = RouterModule.forChild(ROUTES);
