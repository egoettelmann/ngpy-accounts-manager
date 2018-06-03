import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { FileDropModule } from 'ngx-file-drop';
import { ClarityModule } from 'clarity-angular';
import { UIRouterModule } from '@uirouter/angular';
import { HttpClientModule } from '@angular/common/http';
import { AutocompleteComponent } from '../components/autocomplete/autocomplete.component';
import { FileDropComponent } from '../components/file-drop/file-drop.component';
import { GraphComponent } from '../components/graph/graph.component';
import { NavComponent } from '../components/navigation/nav.component';
import { NotificationMessageComponent } from '../components/notification/notification-message.component';
import { NotificationModalComponent } from '../components/notification/notification-modal.component';

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
    NavComponent,
    NotificationMessageComponent,
    NotificationModalComponent
  ];

  static MODULE_LIST = [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    UIRouterModule,
    ClarityModule,
    FormsModule,
    FileDropModule
  ];

}
