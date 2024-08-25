import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterPathPipe } from './router-path.pipe';
import { ROUTER_PATH_CONFIG, RouterPathOptions } from './router-path.models';
import { RouterModule } from '@angular/router';

/**
 * The router path module.
 *
 * This module declares the RouterPathPipe that helps to create router links.
 * The forRoot method should be called in the AppModule to declare the available route paths.
 */
@NgModule({
  declarations: [
    RouterPathPipe
  ],
  exports: [
    RouterModule,
    RouterPathPipe
  ],
  imports: [
    RouterModule
  ]
})
export class AppRouterModule {

  /**
   * To be called in the AppModule to register all available route paths.
   *
   * @param routerPathOptions the router paths options
   */
  static forRoot(routerPathOptions: RouterPathOptions): ModuleWithProviders<AppRouterModule> {
    return {
      ngModule: AppRouterModule,
      providers: [
        {
          provide: RouterPathPipe,
          useValue: new RouterPathPipe(routerPathOptions)
        },
        {
          provide: ROUTER_PATH_CONFIG,
          useValue: routerPathOptions
        }
      ]
    };
  }

}
