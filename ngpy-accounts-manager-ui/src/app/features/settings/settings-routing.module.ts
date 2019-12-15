import { SettingsView } from './views/settings.view';
import { RouterModule, Routes } from '@angular/router';
import { SettingsLabelsView } from './views/labels/settings-labels.view';
import { SettingsAccountsView } from './views/accounts/settings-accounts.view';
import { SettingsCategoriesView } from './views/categories/settings-categories.view';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: SettingsView,
    children: [
      {
        path: 'labels',
        component: SettingsLabelsView
      },
      {
        path: 'categories',
        component: SettingsCategoriesView
      },
      {
        path: 'accounts',
        component: SettingsAccountsView
      },
      {
        path: 'transactions',
        component: SettingsView
      },
      {
        path: '',
        redirectTo: 'labels',
        pathMatch: 'full'
      }
    ]
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class SettingsRoutingModule {

}
