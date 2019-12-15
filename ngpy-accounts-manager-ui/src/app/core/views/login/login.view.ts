import { Component, OnInit } from '@angular/core';
import { SessionRestService } from '../../services/rest/session-rest.service';
import { AppProperties } from '../../models/api.models';
import { RouterService } from '../../services/router.service';

/**
 * The login component
 */
@Component({
  templateUrl: './login.view.html',
  styleUrls: ['./login.view.scss']
})
export class LoginView implements OnInit {

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
   * @param routerService the router service
   * @param sessionService the session service
   */
  constructor(private routerService: RouterService,
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
      this.routerService.navigate('route.main');
    }, () => {
      this.formInError = true;
      this.formIsLoading = false;
    });
  }

}
