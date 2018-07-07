import { RouterModule, Routes } from '@angular/router';

const ROUTES: Routes = [
  {
    path: '',
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
