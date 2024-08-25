import { Routes } from '@angular/router';

export const analyticsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./views/analytics.view').then(m => m.AnalyticsView)
      }
    ]
  }
];
