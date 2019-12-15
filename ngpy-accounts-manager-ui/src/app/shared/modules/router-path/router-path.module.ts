import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterPathPipe } from './router-path.pipe';
import { ROUTER_PATH_CONFIG, RouterPathOptions } from './router-path.models';

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
    RouterPathPipe
  ]
})
export class RouterPathModule {

  /**
   * The default options:
   *  - `defaultRoute`, the default route (to use as fallback): `['/']`
   *  - `pathVariableIdentifier`, the prefix to identifier path variables: `:`
   */
  private static readonly DEFAULT_OPTIONS: RouterPathOptions = {
    paths: undefined,
    defaultRoute: [''],
    pathVariableIdentifier: ':',
  };

  /**
   * To be called in the AppModule to register all available route paths.
   *
   * @param routerPathOptions the router paths options
   */
  static forRoot(routerPathOptions: RouterPathOptions): ModuleWithProviders {
    // Defining the default options
    const options: RouterPathOptions = {
      ...this.DEFAULT_OPTIONS,
      ...routerPathOptions
    };

    // Returning the module with the providers
    return {
      ngModule: RouterPathModule,
      providers: [
        RouterPathPipe,
        {
          provide: ROUTER_PATH_CONFIG,
          useValue: options
        }
      ]
    };
  }

}
