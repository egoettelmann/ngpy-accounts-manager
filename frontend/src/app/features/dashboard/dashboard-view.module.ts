import { NgModule } from '@angular/core';

import { DashboardViewComponent } from './views/dashboard-view.component';
import { DashboardViewRoutingModule } from './dashboard-view-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    DashboardViewComponent,
  ],
  imports: [
    SharedModule,
    DashboardViewRoutingModule
  ]
})
export class DashboardViewModule {
}
