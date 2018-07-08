import { SettingsViewComponent } from './settings-view.component';
import { RouterModule, Routes } from '@angular/router';
import { SettingsLabelsViewComponent } from './labels/settings-labels-view.component';
import { SettingsAccountsViewComponent } from './accounts/settings-accounts-view.component';
import { SettingsCategoriesViewComponent } from './categories/settings-categories-view.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: SettingsViewComponent,
    children: [
      {
        path: 'labels',
        component: SettingsLabelsViewComponent
      },
      {
        path: 'categories',
        component: SettingsCategoriesViewComponent
      },
      {
        path: 'accounts',
        component: SettingsAccountsViewComponent
      },
      {
        path: 'transactions',
        component: SettingsViewComponent
      },
      {
        path: '',
        redirectTo: 'labels',
        pathMatch: 'full'
      }
    ]
  }
];

export const SettingsViewRoutes = RouterModule.forChild(ROUTES);
