import { NgModule } from '@angular/core';
import { UIRouterModule, UIView } from '@uirouter/angular';
import { DecimalPipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { ErrorInterceptor } from './error.interceptor';
import { LoginViewComponent } from './views/login/login-view.component';
import { DashboardViewComponent } from './views/dashboard/dashboard-view.component';
import { TransactionsViewComponent } from './views/transactions/transactions-view.component';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { TreasuryViewComponent } from './views/treasury/treasury-view.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NotificationService } from './components/notification/notification.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AnalyticsViewComponent } from './views/analytics/analytics-view.component';
import { SharedModule } from './modules/shared.module';
import { AccountsService } from './services/accounts.service';
import { StatisticsService } from './services/statistics.service';
import { TransactionsService } from './services/transactions.service';
import { LabelsService } from './services/labels.service';
import { CategoriesService } from './services/categories.service';
import { SessionService } from './services/session.service';
import { UploadService } from './services/upload.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginViewComponent,
    DashboardViewComponent,
    TransactionsViewComponent,
    TreasuryViewComponent,
    AnalyticsViewComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AccountsModule,
    StatisticsModule,
    TransactionsModule,
    SharedModule,
    UIRouterModule.forRoot({
      states: AppConfig.STATES,
      initial: {
        state: 'root.dashboard'
      },
      useHash: true
    }),
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
    AccountsService,
    StatisticsService,
    TransactionsService,
    LabelsService,
    CategoriesService,
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
