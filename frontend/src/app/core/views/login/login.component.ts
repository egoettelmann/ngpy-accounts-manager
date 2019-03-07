import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionRestService } from '../../services/rest/session-rest.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public formInError = false;
  public formIsLoading = false;
  public loginForm: { username?: String, password?: String } = {};

  constructor(private router: Router,
              private sessionService: SessionRestService,
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
