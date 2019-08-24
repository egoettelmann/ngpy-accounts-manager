import { SettingsComponent } from './views/settings.component';
import { RouterModule, Routes } from '@angular/router';
import { SettingsLabelsComponent } from './views/labels/settings-labels.component';
import { SettingsAccountsComponent } from './views/accounts/settings-accounts.component';
import { SettingsCategoriesComponent } from './views/categories/settings-categories.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'labels',
        component: SettingsLabelsComponent
      },
      {
        path: 'categories',
        component: SettingsCategoriesComponent
      },
      {
        path: 'accounts',
        component: SettingsAccountsComponent
      },
      {
        path: 'transactions',
        component: SettingsComponent
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
