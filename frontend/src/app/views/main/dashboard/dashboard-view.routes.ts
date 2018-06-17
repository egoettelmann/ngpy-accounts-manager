import { DashboardViewComponent } from './dashboard-view.component';
import { RouterModule, Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    component: DashboardViewComponent,
  }
];

export const DashboardViewRoutes = RouterModule.forChild(ROUTES);
