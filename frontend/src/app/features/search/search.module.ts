import { NgModule } from '@angular/core';

import { SearchComponent } from './views/search.component';
import { SearchRoutingModule } from './search-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SearchFormComponent } from './components/search-form.component';

@NgModule({
  declarations: [
    SearchFormComponent,
    SearchComponent,
  ],
  imports: [
    SharedModule,
    SearchRoutingModule
  ]
})
export class SearchModule {
}
