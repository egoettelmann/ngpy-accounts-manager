import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent {

  public formInError = false;
  public formIsLoading = false;
  public loginForm: { username?: String, password?: String } = {};

  constructor(private router: Router,
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
      this.router.navigate(['']);
    }, err => {
      this.formInError = true;
      this.formIsLoading = false;
    });
  }

}
