import {Component, OnInit} from '@angular/core';
import {StateService} from '@uirouter/angular';
import {SessionService} from '../session.service';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public loginForm: {username?: String, password?: String} = {};

  constructor(private $state: StateService, private sessionService: SessionService) {}

  ngOnInit(): void {}

  tryLogin(): void {
    this.sessionService.login(this.loginForm).then(data => {
      console.log('LOGIN', data);
      this.$state.go('root.dashboard');
    });
  }

}
