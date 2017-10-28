import {Component, OnInit} from '@angular/core';
import {StateService} from '@uirouter/angular';
import {SessionService} from '../../session.service';

@Component({
  templateUrl: './login-view.component.html'
})
export class LoginViewComponent implements OnInit {

  public formInError = false;
  public formIsLoading = false;
  public loginForm: {username?: String, password?: String} = {};

  constructor(private $state: StateService, private sessionService: SessionService) {}

  ngOnInit(): void {}

  tryLogin(): void {
    this.formInError = false;
    this.formIsLoading = true;
    this.sessionService.login(this.loginForm).then(data => {
      console.log('LOGIN', data);
      this.$state.go('root.dashboard');
    }, err => {
      console.log('FAILED', err);
      this.formInError = true;
      this.formIsLoading = false;
    });
  }

}
