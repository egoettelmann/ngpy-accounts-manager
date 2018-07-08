import { NgModule } from '@angular/core';

import { SettingsViewComponent } from './settings-view.component';
import { SharedModule } from '../../../components/shared/shared.module';
import { SettingsViewRoutes } from './settings-view.routes';
import { SettingsLabelsViewComponent } from './labels/settings-labels-view.component';
import { SettingsAccountsViewComponent } from './accounts/settings-accounts-view.component';
import { SettingsCategoriesViewComponent } from './categories/settings-categories-view.component';

@NgModule({
  declarations: [
    SettingsViewComponent,
    SettingsLabelsViewComponent,
    SettingsCategoriesViewComponent,
    SettingsAccountsViewComponent
  ],
  imports: [
    SharedModule,
    SettingsViewRoutes
  ]
})
export class SettingsViewModule {
}
