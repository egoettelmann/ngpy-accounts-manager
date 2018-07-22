import { TreasuryViewComponent } from './treasury-view.component';
import { RouterModule, Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TreasuryViewComponent
      },
      {
        path: ':year',
        component: TreasuryViewComponent
      }
    ]
  }
];

export const TreasuryViewRoutes = RouterModule.forChild(ROUTES);
