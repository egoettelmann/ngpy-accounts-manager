import { AnalyticsComponent } from './views/analytics.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AnalyticsComponent
      },
      {
        path: ':year',
        component: AnalyticsComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class AnalyticsRoutingModule {

}
