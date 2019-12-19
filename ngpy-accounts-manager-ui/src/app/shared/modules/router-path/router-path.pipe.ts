import { Inject, Pipe, PipeTransform } from '@angular/core';
import { ROUTER_PATH_CONFIG, RouterPath, RouterPathOptions, RouterPathPart } from './router-path.models';
import { Params } from '@angular/router';

/**
 * The router path pipe.
 * Generates a router link from a route name.
 */
@Pipe({
  name: 'routerPath'
})
export class RouterPathPipe implements PipeTransform {

  constructor(@Inject(ROUTER_PATH_CONFIG) private routerPaths: RouterPathOptions) {
  }

  /**
   * Transforms a provided routeKey into a router link path.
   *
   * @param routeKey the route key
   * @param pathVariables the path variables to substitute
   */
  transform(routeKey: string, pathVariables?: Params): RouterPathPart[] {
    // If the route key does not exist, the default route is returned
    if (!this.routerPaths.paths.hasOwnProperty(routeKey)) {
      return this.routerPaths.defaultRoute;
    }

    // Otherwise the route path is generated with the path variables
    console.log(routeKey, this.generateRoutePath(this.routerPaths.paths[routeKey], pathVariables));
    return ['/', ...this.generateRoutePath(this.routerPaths.paths[routeKey], pathVariables)];
  }

  /**
   * Generate the route path for given route URL and the provided path variables.
   *
   * @param routePath the route URL
   * @param pathVariables the path variables to substitute
   */
  private generateRoutePath(routePath: RouterPath, pathVariables?: Params): RouterPathPart[] {
    // If the value is an array, we loop on it
    if (Array.isArray(routePath)) {
      return routePath
        .map(p => this.formatRoutePathPart(p, pathVariables))
        .filter(p => p != null)
        .reduce((arr, p) => arr.concat(p), []);
    }

    // Formatting the value
    return this.formatRoutePathPart(routePath, pathVariables);
  }

  /**
   * Formats a route path part with the provided path variables.
   *
   * @param routePathPart the route part path to format
   * @param pathVariables the path variables to substitute
   */
  private formatRoutePathPart(routePathPart: RouterPathPart, pathVariables: Params): RouterPathPart[] {
    // If it is a string, formatting it
    if (typeof routePathPart === 'string' || routePathPart instanceof String) {
      return this.formatRoute(routePathPart as string, pathVariables);
    }

    // If it is an outlet, formatting the content of it
    if (routePathPart.hasOwnProperty('outlets')) {
      const outlets = {};
      for (const key in routePathPart.outlets) {
        if (routePathPart.outlets.hasOwnProperty(key)) {
          outlets[key] = this.formatRoute(routePathPart.outlets[key], pathVariables);
        }
      }
      return [{
        outlets: outlets
      }];
    }

    return [];
  }

  /**
   * Formats a route the provided path variables.
   *
   * @param routePathPart the route part path to format
   * @param pathVariables the path variables to substitute
   */
  private formatRoute(routePathPart: string, pathVariables: Params): string[] {
    // If the route path part is null or empty, it should be ignored
    if (routePathPart == null || routePathPart === '') {
      return [];
    }

    // If the string includes a slash, it should be split and recursively formatted
    if (routePathPart.includes('/')) {
      return routePathPart.split('/')
        .map(p => this.formatRoute(p, pathVariables))
        .filter(p => p != null)
        .reduce((arr: string[], p) => arr.concat(p), []);
    }

    // If the route path part is not a path variable, nothing to do
    if (!routePathPart.startsWith(this.routerPaths.pathVariableIdentifier)) {
      return [routePathPart];
    }

    // Extracting the path variable
    const pathVariable = routePathPart.substr(1);

    // If the path variable is not defined, nothing to do
    if (!pathVariables.hasOwnProperty(pathVariable)) {
      return [routePathPart];
    }

    // Returning the path variable value
    return [pathVariables[pathVariable]];
  }

}
