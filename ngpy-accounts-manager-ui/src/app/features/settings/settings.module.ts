import { NgModule } from '@angular/core';

import { SettingsView } from './views/settings.view';
import { SharedModule } from '../../shared/shared.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsLabelsView } from './views/labels/settings-labels.view';
import { SettingsAccountsView } from './views/accounts/settings-accounts.view';
import { SettingsCategoriesView } from './views/categories/settings-categories.view';

@NgModule({
  declarations: [
    SettingsView,
    SettingsLabelsView,
    SettingsCategoriesView,
    SettingsAccountsView
  ],
  imports: [
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule {
}
