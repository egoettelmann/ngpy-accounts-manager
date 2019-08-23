import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxFileDropModule } from 'ngx-file-drop';
import { ClarityModule } from '@clr/angular';
import { HttpClientModule } from '@angular/common/http';
import { AutocompleteComponent } from './components/form/autocomplete/autocomplete.component';
import { FileDropComponent } from './components/form/file-drop/file-drop.component';
import { GraphComponent } from './components/graph/graph.component';
import { NotificationMessageComponent } from './components/notification/message/notification-message.component';
import { NotificationModalComponent } from './components/notification/modal/notification-modal.component';
import { FieldWrapperComponent } from './components/form/field-wrapper/field-wrapper.component';
import { KeepFocusDirective } from './directives/keep-focus.directive';
import { AccountsToggleComponent } from './components/toggles/accounts-toggle/accounts-toggle.component';
import { MonthsToggleComponent } from './components/toggles/months-toggle/months-toggle.component';
import { YearsToggleComponent } from './components/toggles/years-toggle/years-toggle.component';
import { SummaryComponent } from './components/statistics/summary/summary.component';
import { TransactionsFormComponent } from './components/transactions/form/transactions-form.component';
import { LabelsToggleComponent } from './components/toggles/labels-toggle/labels-toggle.component';
import { TransactionsTableComponent } from './components/transactions/table/transactions-table.component';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { CategoriesToggleComponent } from './components/toggles/categories-toggle/categories-toggle.component';

@NgModule({
  declarations: SharedModule.COMPONENTS_LIST,
  imports: [
    ...SharedModule.MODULE_LIST
  ],
  exports: [
    ...SharedModule.COMPONENTS_LIST,
    ...SharedModule.MODULE_LIST
  ]
})
export class SharedModule {

  static COMPONENTS_LIST = [
    AutocompleteComponent,
    FileDropComponent,
    FieldWrapperComponent,
    GraphComponent,
    NotificationMessageComponent,
    NotificationModalComponent,
    KeepFocusDirective,
    AccountsToggleComponent,
    MonthsToggleComponent,
    YearsToggleComponent,
    SummaryComponent,
    TransactionsFormComponent,
    LabelsToggleComponent,
    CategoriesToggleComponent,
    TransactionsTableComponent
  ];

  static MODULE_LIST = [
    CommonModule,
    LayoutModule,
    HttpClientModule,
    TranslateModule,
    RouterModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    NgxFileDropModule
  ];

}
