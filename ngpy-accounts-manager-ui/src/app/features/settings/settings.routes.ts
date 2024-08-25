import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/settings.view').then(m => m.SettingsView),
    children: [
      {
        path: 'labels',
        loadComponent: () => import('./views/labels/settings-labels.view').then(m => m.SettingsLabelsView)
      },
      {
        path: 'categories',
        loadComponent: () => import('./views/categories/settings-categories.view').then(m => m.SettingsCategoriesView)
      },
      {
        path: 'accounts',
        loadComponent: () => import('./views/accounts/settings-accounts.view').then(m => m.SettingsAccountsView)
      },
      {
        path: '',
        redirectTo: 'labels',
        pathMatch: 'full'
      }
    ]
  }
];
