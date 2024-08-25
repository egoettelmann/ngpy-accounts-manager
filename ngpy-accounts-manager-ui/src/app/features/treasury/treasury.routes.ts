import { TreasuryView } from './views/treasury.view';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const treasuryRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TreasuryView
      }
    ]
  }
];
