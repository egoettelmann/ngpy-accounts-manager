import { TreasuryComponent } from './views/treasury.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TreasuryComponent
      },
      {
        path: ':year',
        component: TreasuryComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class TreasuryRoutingModule {

}
