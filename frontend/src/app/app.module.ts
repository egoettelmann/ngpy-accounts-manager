import { NgModule } from '@angular/core';
import { UIRouterModule, UIView } from '@uirouter/angular';
import { ClarityModule } from 'clarity-angular';
import { DecimalPipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavComponent } from './components/navigation/nav.component';
import { AppConfig } from './app.config';
import { ErrorInterceptor } from './error.interceptor';
import { LoginViewComponent } from './views/login/login-view.component';
import { SessionService } from './session.service';
import { DashboardViewComponent } from './views/dashboard/dashboard-view.component';
import { TransactionsViewComponent } from './views/transactions/transactions-view.component';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { GraphComponent } from './components/graph/graph.component';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { TreasuryViewComponent } from './views/treasury/treasury-view.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NotificationService } from './components/notification/notification.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationModalComponent } from './components/notification/notification-modal.component';
import { NotificationMessageComponent } from './components/notification/notification-message.component';
import { FileDropModule } from 'ngx-file-drop';
import { FileDropComponent } from './components/file-drop/file-drop.component';
import { UploadService } from './components/file-drop/upload.service';
import { RestService } from './modules/shared/rest.service';
import { SharedModule } from './modules/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { AnalyticsViewComponent } from './views/analytics/analytics-view.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    LoginViewComponent,
    AppComponent,
    NavComponent,
    FileDropComponent,
    NotificationMessageComponent,
    NotificationModalComponent,
    DashboardViewComponent,
    TransactionsViewComponent,
    TreasuryViewComponent,
    AnalyticsViewComponent,
    GraphComponent
  ],
  imports: [
    BrowserAnimationsModule,
    TransactionsModule,
    AccountsModule,
    StatisticsModule,
    BrowserModule,
    SharedModule,
    HttpClientModule,
    FileDropModule,
    UIRouterModule.forRoot({
      states: AppConfig.STATES,
      initial: {
        state: 'root.dashboard'
      },
      useHash: true
    }),
    ClarityModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    DecimalPipe,
    SessionService,
    UploadService,
    RestService,
    NotificationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [UIView]
})
export class AppModule {
}
