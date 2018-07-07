import { AnalyticsViewComponent } from './analytics-view.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonFunctions } from '../../../common/common-functions';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: ':year',
        component: AnalyticsViewComponent
      },
      {
        path: '',
        redirectTo: CommonFunctions.getCurrentYear().toString(),
        pathMatch: 'full'
      }
    ]
  }
];

export const AnalyticsViewRoutes = RouterModule.forChild(ROUTES);
