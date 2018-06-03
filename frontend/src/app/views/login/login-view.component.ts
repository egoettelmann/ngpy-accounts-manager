import { Component } from '@angular/core';
import { StateService } from '@uirouter/angular';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from '../../services/session.service';

@Component({
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent {

  public formInError = false;
  public formIsLoading = false;
  public loginForm: {username?: String, password?: String} = {};

  constructor(private $state: StateService,
              private sessionService: SessionService,
              private translate: TranslateService
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  tryLogin(): void {
    this.formInError = false;
    this.formIsLoading = true;
    this.sessionService.login(this.loginForm).subscribe(data => {
      this.$state.go('root.dashboard');
    }, err => {
      this.formInError = true;
      this.formIsLoading = false;
    });
  }

}
