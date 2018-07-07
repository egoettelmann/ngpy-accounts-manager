import { TreasuryViewComponent } from './treasury-view.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonFunctions } from '../../../common/common-functions';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: ':year',
        component: TreasuryViewComponent
      },
      {
        path: '',
        redirectTo: CommonFunctions.getCurrentYear().toString(),
        pathMatch: 'full'
      }
    ]
  }
];

export const TreasuryViewRoutes = RouterModule.forChild(ROUTES);
