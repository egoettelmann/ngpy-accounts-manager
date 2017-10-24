import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {UIRouterModule, UIView} from '@uirouter/angular';
import { ClarityModule } from 'clarity-angular';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { NavComponent } from './nav/nav.component';
import { AppConfig } from './app.config';
import {DashboardComponent} from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent, NavComponent, DashboardComponent, TransactionsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    UIRouterModule.forRoot({ states: AppConfig.STATES, initial: {state: 'root.dashboard'}, useHash: true }),
    ClarityModule.forRoot()
  ],
  providers: [],
  bootstrap: [UIView]
})
export class AppModule { }
