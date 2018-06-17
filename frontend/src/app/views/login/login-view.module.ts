import { NgModule } from '@angular/core';
import { UIView } from '@uirouter/angular';
import { LoginViewComponent } from './login-view.component';
import { LoginViewRoutes } from './login-view.routes';
import { SharedModule } from '../../components/shared/shared.module';

@NgModule({
  declarations: [
    LoginViewComponent
  ],
  imports: [
    SharedModule,
    LoginViewRoutes
  ],
  bootstrap: [UIView]
})
export class LoginViewModule {
}
