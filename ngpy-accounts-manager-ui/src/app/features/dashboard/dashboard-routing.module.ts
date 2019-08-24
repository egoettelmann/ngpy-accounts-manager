import { DashboardComponent } from './views/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class DashboardRoutingModule {

}
