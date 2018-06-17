import { LoginViewComponent } from './login-view.component';
import { RouterModule, Routes } from '@angular/router';

const ROUTES: Routes = [
  {
    path: '',
    component: LoginViewComponent
  }
];

export const LoginViewRoutes = RouterModule.forChild(ROUTES);
