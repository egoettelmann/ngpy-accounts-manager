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
import { NotificationModalComponent } from './components/notification-modal/notification-modal.component';
import { FieldWrapperComponent } from './components/form/field-wrapper/field-wrapper.component';
import { KeepFocusDirective } from './directives/keep-focus.directive';
import { AccountsToggleComponent } from './components/toggles/accounts-toggle/accounts-toggle.component';
import { MonthsToggleComponent } from './components/toggles/months-toggle/months-toggle.component';
import { YearsToggleComponent } from './components/toggles/years-toggle/years-toggle.component';
import { SummaryComponent } from './components/summary/summary.component';
import { LabelsToggleComponent } from './components/toggles/labels-toggle/labels-toggle.component';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { CategoriesToggleComponent } from './components/toggles/categories-toggle/categories-toggle.component';
import { CardWrapperComponent } from './components/cards/card-wrapper.component';
import { RouterPathModule } from './modules/router-path/router-path.module';
import { TransactionsTableComponent } from './components/tables/transactions-table/transactions-table.component';
import { ToLabelPipe } from './pipes/to-label.pipe';
import { ToCategoryPipe } from './pipes/to-category.pipe';

@NgModule({
  declarations: [
    ...SharedModule.COMPONENTS_LIST,
    ...SharedModule.DIRECTIVE_LIST,
    ...SharedModule.PIPES_LIST
  ],
  imports: [
    ...SharedModule.MODULES_LIST
  ],
  exports: [
    ...SharedModule.COMPONENTS_LIST,
    ...SharedModule.DIRECTIVE_LIST,
    ...SharedModule.PIPES_LIST,
    ...SharedModule.MODULES_LIST
  ]
})
export class SharedModule {

  static COMPONENTS_LIST = [
    AutocompleteComponent,
    FileDropComponent,
    FieldWrapperComponent,
    CardWrapperComponent,
    GraphComponent,
    NotificationModalComponent,
    AccountsToggleComponent,
    MonthsToggleComponent,
    YearsToggleComponent,
    SummaryComponent,
    LabelsToggleComponent,
    CategoriesToggleComponent,
    TransactionsTableComponent
  ];

  static DIRECTIVE_LIST = [
    KeepFocusDirective
  ];

  static PIPES_LIST = [
    ToLabelPipe,
    ToCategoryPipe
  ];

  static MODULES_LIST = [
    CommonModule,
    LayoutModule,
    HttpClientModule,
    TranslateModule,
    RouterModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    RouterPathModule
  ];

}
