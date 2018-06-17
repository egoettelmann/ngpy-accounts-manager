import { NgModule } from '@angular/core';

import { MainViewComponent } from './main-view.component';
import { MainViewRoutes } from './main-view.routes';
import { NavComponent } from './navigation/nav.component';
import { SharedModule } from '../../components/shared/shared.module';

@NgModule({
  declarations: [
    MainViewComponent,
    NavComponent
  ],
  imports: [
    SharedModule,
    MainViewRoutes
  ]
})
export class MainViewModule {
}
