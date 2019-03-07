import { SettingsViewComponent } from './views/settings-view.component';
import { RouterModule, Routes } from '@angular/router';
import { SettingsLabelsViewComponent } from './views/labels/settings-labels-view.component';
import { SettingsAccountsViewComponent } from './views/accounts/settings-accounts-view.component';
import { SettingsCategoriesViewComponent } from './views/categories/settings-categories-view.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
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


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class SettingsViewRoutingModule {

}
