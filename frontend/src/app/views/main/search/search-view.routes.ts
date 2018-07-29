import { SearchViewComponent } from './search-view.component';
import { RouterModule, Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    component: SearchViewComponent
  }
];

export const SearchViewRoutes = RouterModule.forChild(ROUTES);
