import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { mergeMap } from 'rxjs';
import { ConfigurationService } from '../services/configuration.service';
import { map } from 'rxjs/operators';

/**
 * Intercepts the request to add the base URL of the API.
 *
 * @param req the request
 * @param next the next handler function
 */
export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const configurationService = inject(ConfigurationService);
  // Calls to 'local' assets are not handled
  if (req.url.startsWith('/assets')) {
    return next(req.clone());
  }

  // Adding base url to all API calls
  return configurationService.getApiConfiguration().pipe(
    map(appProperties => appProperties.apiUrl),
    map(apiUrl => req.clone({ url: apiUrl + req.url })),
    mergeMap(apiReq => next(apiReq))
  );
};

