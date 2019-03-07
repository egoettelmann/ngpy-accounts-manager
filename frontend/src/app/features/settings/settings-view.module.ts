import { NgModule } from '@angular/core';

import { SettingsViewComponent } from './views/settings-view.component';
import { SharedModule } from '../../shared/shared.module';
import { SettingsViewRoutingModule } from './settings-view-routing.module';
import { SettingsLabelsViewComponent } from './views/labels/settings-labels-view.component';
import { SettingsAccountsViewComponent } from './views/accounts/settings-accounts-view.component';
import { SettingsCategoriesViewComponent } from './views/categories/settings-categories-view.component';

@NgModule({
  declarations: [
    SettingsViewComponent,
    SettingsLabelsViewComponent,
    SettingsCategoriesViewComponent,
    SettingsAccountsViewComponent
  ],
  imports: [
    SharedModule,
    SettingsViewRoutingModule
  ]
})
export class SettingsViewModule {
}
