import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/dashboard.view').then(m => m.DashboardView)
  }
];
