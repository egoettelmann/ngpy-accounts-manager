import { NgModule, Optional, SkipSelf } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NavComponent } from './components/navigation/nav.component';
import { LoginViewComponent } from './views/login/login-view.component';
import { MainViewComponent } from './views/main/main-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DecimalPipe } from '@angular/common';
import { SessionService } from './services/rest/session.service';
import { UploadService } from './services/rest/upload.service';
import { AccountsService } from './services/rest/accounts.service';
import { StatisticsService } from './services/rest/statistics.service';
import { TransactionsService } from './services/rest/transactions.service';
import { LabelsService } from './services/rest/labels.service';
import { CategoriesService } from './services/rest/categories.service';
import { NotificationService } from './services/notification.service';
import { KeepFocusService } from './services/keep-focus.service';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { SharedModule } from '../shared/shared.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    ...CoreModule.COMPONENTS_LIST
  ],
  imports: [
    SharedModule,
    ...CoreModule.MODULE_LIST
  ],
  exports: [
    SharedModule,
    ...CoreModule.COMPONENTS_LIST
  ],
  providers: [
    ...CoreModule.SERVICE_LIST,
    ...CoreModule.PROVIDER_LIST
  ]
})
export class CoreModule {

  /**
   * Core components
   */
  static COMPONENTS_LIST = [
    NavComponent,
    LoginViewComponent,
    MainViewComponent
  ];

  /**
   * Core modules
   */
  static MODULE_LIST = [
    BrowserAnimationsModule,
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ];

  /**
   * Core services (root scope)
   */
  static SERVICE_LIST = [
    /** REST services */
    SessionService,
    UploadService,
    AccountsService,
    StatisticsService,
    TransactionsService,
    LabelsService,
    CategoriesService,
    /** App services */
    NotificationService,
    KeepFocusService
  ];

  /**
   * Pipes, interceptors, guards, etc.
   */
  static PROVIDER_LIST = [
    DecimalPipe,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
    }
  ];

  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }

}
