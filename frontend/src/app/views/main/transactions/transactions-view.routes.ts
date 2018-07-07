import { TransactionsViewComponent } from './transactions-view.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonFunctions } from '../../../common/common-functions';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: ':year/:month',
        component: TransactionsViewComponent
      },
      {
        path: '',
        redirectTo: CommonFunctions.getCurrentYear().toString() + '/' + CommonFunctions.getCurrentMonth().toString(),
        pathMatch: 'full'
      }
    ]
  }
];

export const TransactionsViewRoutes = RouterModule.forChild(ROUTES);
