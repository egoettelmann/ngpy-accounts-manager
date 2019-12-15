import { Inject, Pipe, PipeTransform } from '@angular/core';
import { ROUTER_PATH_CONFIG, RouterPathOptions } from './router-path.models';

/**
 * The router path pipe.
 * Generates a router link from a route name.
 */
@Pipe({
  name: 'routerPath'
})
export class RouterPathPipe implements PipeTransform {

  constructor(@Inject(ROUTER_PATH_CONFIG) private routerPaths: RouterPathOptions) {}

  /**
   * Transforms a provided routeKey into a router link path.
   *
   * @param routeKey the route key
   * @param pathVariables the path variables to substitute
   */
  transform(routeKey: string, pathVariables?: {[key: string]: any}): string[] {
    // If the route key does not exist, the default route is returned
    if (!this.routerPaths.paths.hasOwnProperty(routeKey)) {
      return this.routerPaths.defaultRoute;
    }

    // Otherwise the route path is generated with the path variables
    return this.generateRoutePath(this.routerPaths.paths[routeKey], pathVariables);
  }

  /**
   * Generate the route path for given route URL and the provided path variables.
   *
   * @param routePath the route URL
   * @param pathVariables the path variables to substitute
   */
  private generateRoutePath(routePath: string, pathVariables?: {[key: string]: any}): string[] {
    const values = routePath.split('/');

    // If no path variables provided, nothing to do
    if (pathVariables == null) {
      return values;
    }

    // Otherwise, all path variables are interpolated
    return values
      .map(p => this.formatRoutePathPart(p, pathVariables))
      .filter(p => p != null);
  }

  /**
   * Formats a route path part with the provided path variables.
   *
   * @param routePathPart the route part path to format
   * @param pathVariables the path variables to substitute
   */
  private formatRoutePathPart(routePathPart: string, pathVariables: {[key: string]: any}): string {
    // If the route path part is null or empty, it should be ignored
    if (routePathPart == null || routePathPart === '') {
      return undefined;
    }

    // If the route path part is not a path variable, nothing to do
    if (!routePathPart.startsWith(this.routerPaths.pathVariableIdentifier)) {
      return routePathPart;
    }

    // Extracting the path variable
    const pathVariable = routePathPart.substr(1);

    // If the path variable is not defined, nothing to do
    if (!pathVariables.hasOwnProperty(pathVariable)) {
      return routePathPart;
    }

    // Returning the path variable value
    return pathVariables[pathVariable];
  }
}
