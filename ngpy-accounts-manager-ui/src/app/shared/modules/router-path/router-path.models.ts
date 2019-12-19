import { InjectionToken } from '@angular/core';

/**
 * The router outlet path interface
 */
export interface RouterOutletPath {
  outlets: {
    [key: string]: string
  };
}

/**
 * The router path part type
 */
export declare type RouterPathPart = string | RouterOutletPath;

/**
 * The router path part type
 */
export declare type RouterPath = RouterPathPart | RouterPathPart[];

/**
 * The map of route paths.
 *  - the key is used to identify each route
 *  - the value is the path to route to (can contain path variables)
 */
export interface RouterPaths {
  [key: string]: RouterPath;
}

/**
 * The router path options to be used to configure the module.
 * In addition to the route paths, it defines the default route and the path variable identifier.
 */
export interface RouterPathOptions {
  paths: RouterPaths;
  defaultRoute?: string[];
  pathVariableIdentifier?: string;
}

/**
 * The injection token to retrieve the router path options in the pipe.
 */
export const ROUTER_PATH_CONFIG = new InjectionToken<RouterPathOptions>('RouterPathOptions');
