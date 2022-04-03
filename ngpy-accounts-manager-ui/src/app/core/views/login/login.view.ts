import { Component, OnInit } from '@angular/core';
import { SessionRestService } from '../../services/rest/session-rest.service';
import { AppProperties } from '../../models/api.models';
import { RouterService } from '../../services/router.service';
import { catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable, throwError } from 'rxjs';

/**
 * The login component
 */
@Component({
  templateUrl: './login.view.html',
  styleUrls: ['./login.view.scss']
})
export class LoginView implements OnInit {

  /**
   * The login form
   */
  public loginForm?: FormGroup;

  /**
   * The form is loading flag
   */
  public formIsLoading = false;

  /**
   * The app properties
   */
  public appProperties?: AppProperties;

  /**
   * Instantiates the component.
   *
   * @param routerService the router service
   * @param sessionService the session service
   * @param fb the form builder
   */
  constructor(private routerService: RouterService,
              private sessionService: SessionRestService,
              private fb: FormBuilder
  ) {
  }

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.buildForm();
    this.sessionService.getProperties().subscribe(data => {
      this.appProperties = data;
    });
  }

  /**
   * Tries to login the user with the credentials provided through the form.
   * If the login is successful, redirects to the app.
   */
  tryLogin(): void {
    if (!this.loginForm || this.loginForm.invalid || this.formIsLoading) {
      return;
    }
    this.formIsLoading = true;
    this.sessionService.login(this.loginForm.value).pipe(
      catchError(err => this.handleLoginError(err))
    ).subscribe(() => {
      this.routerService.navigate('route.main');
    }, () => {
      this.formIsLoading = false;
    });
  }

  private buildForm(): void {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  private handleLoginError(error: any): Observable<never> {
    if (!error || error.code !== 'A400') {
      return throwError(error);
    }

    this.loginForm?.setErrors({
      [error.message]: true
    });

    this.formIsLoading = false;
    return EMPTY;
  }

}
