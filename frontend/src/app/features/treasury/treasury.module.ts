import { NgModule } from '@angular/core';

import { TreasuryComponent } from './views/treasury.component';
import { TreasuryRoutingModule } from './treasury-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    TreasuryComponent,
  ],
  imports: [
    SharedModule,
    TreasuryRoutingModule
  ]
})
export class TreasuryModule {
}
