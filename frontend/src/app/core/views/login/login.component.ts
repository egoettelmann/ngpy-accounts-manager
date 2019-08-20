import { Component, OnInit } from '@angular/core';
import { SessionRestService } from '../../services/rest/session-rest.service';
import { Router } from '@angular/router';
import { AppProperties } from '../../models/api.models';

/**
 * The login component
 */
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  /**
   * The form in error flag
   */
  public formInError = false;

  /**
   * The form is loading flag
   */
  public formIsLoading = false;

  /**
   * The login form object
   */
  public loginForm: { username?: String, password?: String } = {};

  /**
   * The app properties
   */
  public appProperties: AppProperties;

  /**
   * Instantiates the component.
   *
   * @param router the router
   * @param sessionService the session service
   */
  constructor(private router: Router,
              private sessionService: SessionRestService
  ) {
  }

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.sessionService.getProperties().subscribe(data => {
      this.appProperties = data;
    });
  }

  /**
   * Tries to login the user with the credentials provided through the form.
   * If the login is successful, redirects to the app.
   */
  tryLogin(): void {
    this.formInError = false;
    this.formIsLoading = true;
    this.sessionService.login(this.loginForm).subscribe(() => {
      this.router.navigate(['']);
    }, () => {
      this.formInError = true;
      this.formIsLoading = false;
    });
  }

}
