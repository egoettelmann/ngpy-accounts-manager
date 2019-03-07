import { AnalyticsViewComponent } from './views/analytics-view.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AnalyticsViewComponent
      },
      {
        path: ':year',
        component: AnalyticsViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class AnalyticsViewRoutingModule {

}
