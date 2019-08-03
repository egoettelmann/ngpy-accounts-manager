import { Component, HostBinding } from '@angular/core';

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  @HostBinding('class') hostClass = 'content-container';

}
