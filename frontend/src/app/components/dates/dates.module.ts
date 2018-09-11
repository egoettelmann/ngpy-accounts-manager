import { NgModule } from '@angular/core';
import { YearToggleComponent } from './year-toggle.component';
import { MonthToggleComponent } from './month-toggle.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    YearToggleComponent,
    MonthToggleComponent
  ],
  exports: [
    YearToggleComponent,
    MonthToggleComponent
  ],
  imports: [
    SharedModule
  ]
})
export class DatesModule {
}
