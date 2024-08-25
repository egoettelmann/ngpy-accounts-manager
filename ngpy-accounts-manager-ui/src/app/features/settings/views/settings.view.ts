import { Component, HostBinding } from '@angular/core';
import { ClrVerticalNavModule } from '@clr/angular';
import { AppRouterModule } from '@shared/modules/app-router/app-router.module';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  templateUrl: './settings.view.html',
  styleUrls: ['./settings.view.scss'],
  imports: [
    TranslateModule,
    AppRouterModule,
    ClrVerticalNavModule
  ]
})
export class SettingsView {

  @HostBinding('class') hostClass = 'content-container';

}
