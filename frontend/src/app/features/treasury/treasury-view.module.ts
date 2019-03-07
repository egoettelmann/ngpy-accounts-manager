import { NgModule } from '@angular/core';

import { TreasuryViewComponent } from './views/treasury-view.component';
import { TreasuryViewRoutingModule } from './treasury-view-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    TreasuryViewComponent,
  ],
  imports: [
    SharedModule,
    TreasuryViewRoutingModule
  ]
})
export class TreasuryViewModule {
}
