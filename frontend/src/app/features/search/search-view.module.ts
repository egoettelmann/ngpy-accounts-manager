import { NgModule } from '@angular/core';

import { SearchViewComponent } from './views/search-view.component';
import { SearchViewRoutingModule } from './search-view-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    SearchViewComponent,
  ],
  imports: [
    SharedModule,
    SearchViewRoutingModule
  ]
})
export class SearchViewModule {
}
