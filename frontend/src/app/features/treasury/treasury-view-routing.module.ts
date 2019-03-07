import { TreasuryViewComponent } from './views/treasury-view.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TreasuryViewComponent
      },
      {
        path: ':year',
        component: TreasuryViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class TreasuryViewRoutingModule {

}
