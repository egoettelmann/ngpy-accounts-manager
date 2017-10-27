import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {UIRouterModule, UIView} from '@uirouter/angular';
import { ClarityModule } from 'clarity-angular';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { NavComponent } from './nav/nav.component';
import { AppConfig } from './app.config';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ErrorInterceptor} from './error.interceptor';
import {LoginComponent} from './login/login.component';
import {FormsModule} from '@angular/forms';
import {SessionService} from './session.service';
import {TransactionsService} from './transactions/transactions.service';

@NgModule({
  declarations: [
    AppComponent, NavComponent, DashboardComponent, TransactionsComponent, LoginComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,
    UIRouterModule.forRoot({ states: AppConfig.STATES, initial: {state: 'root.dashboard'}, useHash: true }),
    ClarityModule.forRoot()
  ],
  providers: [
    SessionService,
    TransactionsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [UIView]
})
export class AppModule { }
