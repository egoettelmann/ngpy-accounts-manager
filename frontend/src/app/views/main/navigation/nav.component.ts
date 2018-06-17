import { Component } from '@angular/core';
import {StateService} from '@uirouter/angular';
import { SessionService } from '../../../services/session.service';

@Component({
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  constructor(private $state: StateService,
              private sessionService: SessionService
  ) {}

  clickLogout(): void {
    this.sessionService.logout().subscribe(() => {
      this.$state.go('login');
    });
  }

}
