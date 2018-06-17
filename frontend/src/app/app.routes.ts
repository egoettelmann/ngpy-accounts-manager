import 'rxjs/add/operator/toPromise';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';

const ROUTES: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'login',
        loadChildren: './views/login/login-view.module#LoginViewModule'
      },
      {
        path: '',
        loadChildren: './views/main/main-view.module#MainViewModule'
      }
    ]
  }
];

export const AppRoutes = RouterModule.forRoot(ROUTES, {useHash: true});
