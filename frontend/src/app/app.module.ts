import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import { ErrorInterceptor } from './error.interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AccountsService } from './services/accounts.service';
import { StatisticsService } from './services/statistics.service';
import { TransactionsService } from './services/transactions.service';
import { LabelsService } from './services/labels.service';
import { CategoriesService } from './services/categories.service';
import { SessionService } from './services/session.service';
import { UploadService } from './services/upload.service';
import { SharedModule } from './components/shared/shared.module';
import { NotificationService } from './components/shared/notification/notification.service';
import { KeepFocusService } from './directives/keep-focus.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    SharedModule,
    AppRoutes,
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
    KeepFocusService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
