import { Component, OnInit } from '@angular/core';
import { SessionRestService } from '../../services/rest/session-rest.service';
import { AppProperties } from '../../models/api.models';
import { RouterService } from '../../services/router.service';
import { catchError } from 'rxjs/operators';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { ConfigurationService } from '@core/services/configuration.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ClrAlertModule, ClrIconModule, ClrInputModule } from '@clr/angular';
import { NotificationModalComponent } from '@shared/components/modals/notification/notification-modal.component';
import { checkCircleIcon, ClarityIcons, exclamationCircleIcon } from '@cds/core/icon';

/**
 * The login component
 */
@Component({
  standalone: true,
  templateUrl: './login.view.html',
  styleUrls: ['./login.view.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ClrInputModule,
    ClrAlertModule,
    ClrIconModule,
    NotificationModalComponent
  ]
})
export class LoginView implements OnInit {

  public bgImage = `https://picsum.photos/seed/${new Date().getMonth()}/1920/1080`;

  /**
   * The login form
   */
  public loginForm?: UntypedFormGroup;

  /**
   * The form is loading flag
   */
  public formIsLoading = false;

  /**
   * The app properties
   */
  public appProperties?: AppProperties;

  /**
   * The current API status
   */
  public apiStatus?: { ready: boolean, progress?: number};

  /**
   * Instantiates the component.
   *
   * @param routerService the router service
   * @param configurationService the configuration service
   * @param sessionService the session service
   * @param fb the form builder
   */
  constructor(private routerService: RouterService,
              private configurationService: ConfigurationService,
              private sessionService: SessionRestService,
              private fb: UntypedFormBuilder
  ) {
    ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
  }

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.buildForm();
    this.configurationService.getApiProperties().subscribe(data => {
      this.appProperties = data;
    });
    this.configurationService.getApiStatus(35000, 4).pipe(
      catchError(() => {
        return of({
          ready: false
        });
      })
    ).subscribe(apiStatus => {
      this.apiStatus = apiStatus;
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

  get formErrors(): string[] {
    if (!this.loginForm || !this.loginForm.errors) {
      return [];
    }
    return Object.keys(this.loginForm.errors);
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
