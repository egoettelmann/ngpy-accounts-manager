import { NgModule } from '@angular/core';

import { TreasuryView } from './views/treasury.view';
import { TreasuryRoutingModule } from './treasury-routing.module';
import { SharedModule } from '@shared/shared.module';
import { TreasuryEvolutionChartComponent } from './components/evolution-chart/treasury-evolution-chart.component';

@NgModule({
  declarations: [
    TreasuryView,
    TreasuryEvolutionChartComponent
  ],
  imports: [
    SharedModule,
    TreasuryRoutingModule
  ]
})
export class TreasuryModule {
}
