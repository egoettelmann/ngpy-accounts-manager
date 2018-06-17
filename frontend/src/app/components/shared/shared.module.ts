import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { FileDropModule } from 'ngx-file-drop';
import { ClarityModule } from 'clarity-angular';
import { HttpClientModule } from '@angular/common/http';
import { AutocompleteComponent } from './form/autocomplete/autocomplete.component';
import { FileDropComponent } from './form/file-drop/file-drop.component';
import { GraphComponent } from './graph/graph.component';
import { NotificationMessageComponent } from './notification/message/notification-message.component';
import { NotificationModalComponent } from './notification/modal/notification-modal.component';

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
    GraphComponent,
    NotificationMessageComponent,
    NotificationModalComponent
  ];

  static MODULE_LIST = [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    ClarityModule,
    FormsModule,
    FileDropModule
  ];

}
