import { NgModule } from '@angular/core';

import { SettingsComponent } from './views/settings.component';
import { SharedModule } from '../../shared/shared.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsLabelsComponent } from './views/labels/settings-labels.component';
import { SettingsAccountsComponent } from './views/accounts/settings-accounts.component';
import { SettingsCategoriesComponent } from './views/categories/settings-categories.component';

@NgModule({
  declarations: [
    SettingsComponent,
    SettingsLabelsComponent,
    SettingsCategoriesComponent,
    SettingsAccountsComponent
  ],
  imports: [
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule {
}
