import { NgModule, Optional, SkipSelf } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NavComponent } from './components/navigation/nav.component';
import { LoginComponent } from './views/login/login.component';
import { MainComponent } from './views/main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DecimalPipe } from '@angular/common';
import { SessionRestService } from './services/rest/session-rest.service';
import { UploadRestService } from './services/rest/upload-rest.service';
import { AccountsRestService } from './services/rest/accounts-rest.service';
import { StatisticsRestService } from './services/rest/statistics-rest.service';
import { TransactionsRestService } from './services/rest/transactions-rest.service';
import { LabelsRestService } from './services/rest/labels-rest.service';
import { CategoriesRestService } from './services/rest/categories-rest.service';
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
    LoginComponent,
    MainComponent
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
    SessionRestService,
    UploadRestService,
    AccountsRestService,
    StatisticsRestService,
    TransactionsRestService,
    LabelsRestService,
    CategoriesRestService,
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
