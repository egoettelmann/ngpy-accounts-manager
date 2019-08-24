import { NgModule } from '@angular/core';

import { TreasuryComponent } from './views/treasury.component';
import { TreasuryRoutingModule } from './treasury-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { TreasuryEvolutionChartComponent } from './components/treasury-evolution-chart/treasury-evolution-chart.component';

@NgModule({
  declarations: [
    TreasuryComponent,
    TreasuryEvolutionChartComponent
  ],
  imports: [
    SharedModule,
    TreasuryRoutingModule
  ]
})
export class TreasuryModule {
}
