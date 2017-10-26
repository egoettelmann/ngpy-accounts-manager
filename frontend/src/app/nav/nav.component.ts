import { Component } from '@angular/core';
import {StateService} from '@uirouter/angular';
import {SessionService} from '../session.service';

@Component({
  templateUrl: './nav.component.html'
})
export class NavComponent {

  constructor(private $state: StateService, private sessionService: SessionService) {}

  clickLogout(): void {
    console.log('logout');
    this.sessionService.logout().then(() => {
      this.$state.go('login');
    });
  }

}
