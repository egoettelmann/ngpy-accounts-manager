import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {UIRouterModule, UIView} from '@uirouter/angular';
import {ClarityModule} from 'clarity-angular';
import {CommonModule, DecimalPipe} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {NavComponent} from './components/navigation/nav.component';
import {AppConfig} from './app.config';
import {ErrorInterceptor} from './error.interceptor';
import {LoginViewComponent} from './views/login/login-view.component';
import {FormsModule} from '@angular/forms';
import {SessionService} from './session.service';
import {DashboardViewComponent} from './views/dashboard/dashboard-view.component';
import {TransactionsViewComponent} from './views/transactions/transactions-view.component';
import {TransactionsModule} from './modules/transactions/transactions.module';
import {AccountsModule} from './modules/accounts/accounts.module';
import {GraphComponent} from './components/graph/graph.component';
import {StatisticsModule} from './modules/statistics/statistics.module';
import {TreasuryViewComponent} from './views/treasury/treasury-view.component';

@NgModule({
  declarations: [
    LoginViewComponent,
    AppComponent,
    NavComponent,
    DashboardViewComponent,
    TransactionsViewComponent,
    TreasuryViewComponent,
    GraphComponent
  ],
  imports: [
    TransactionsModule,
    AccountsModule,
    StatisticsModule,
    FormsModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,
    UIRouterModule.forRoot({ states: AppConfig.STATES, initial: {state: 'root.dashboard'}, useHash: true }),
    ClarityModule.forRoot()
  ],
  providers: [
    DecimalPipe,
    SessionService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [UIView]
})
export class AppModule { }
