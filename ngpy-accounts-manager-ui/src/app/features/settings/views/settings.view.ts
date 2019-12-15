import { Component, HostBinding } from '@angular/core';

@Component({
  templateUrl: './settings.view.html',
  styleUrls: ['./settings.view.scss']
})
export class SettingsView {

  @HostBinding('class') hostClass = 'content-container';

}
