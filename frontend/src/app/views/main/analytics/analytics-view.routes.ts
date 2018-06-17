import { AnalyticsViewComponent } from './analytics-view.component';
import { RouterModule, Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: ':year',
    component: AnalyticsViewComponent
  }
];

export const AnalyticsViewRoutes = RouterModule.forChild(ROUTES);
