import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionRestService } from '../../services/rest/session-rest.service';
import { Router } from '@angular/router';
import { AppProperties } from '../../models/api.models';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public formInError = false;
  public formIsLoading = false;
  public loginForm: { username?: String, password?: String } = {};
  public appProperties: AppProperties;

  constructor(private router: Router,
              private sessionService: SessionRestService
  ) {
  }

  ngOnInit(): void {
    this.sessionService.getProperties().subscribe(data => {
      this.appProperties = data;
    });
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
