import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../services/configuration.service';
import { flatMap, map } from 'rxjs/operators';

/**
 * The API url interceptor
 */
@Injectable()
export class ApiUrlInterceptor implements HttpInterceptor {

  /**
   * The configuration service.
   */
  private configurationService: ConfigurationService;

  /**
   * Instantiates the interceptor.
   *
   * @param configurationService the configuration service
   */
  constructor(configurationService: ConfigurationService) {
    this.configurationService = configurationService;
  }

  /**
   * Intercepts the request to add the base URL of the API.
   *
   * @param req the request
   * @param next the handler
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Calls to 'local' assets are not handled
    if (req.url.startsWith('/assets')) {
      return next.handle(req.clone());
    }

    // Adding base url to all API calls
    return this.configurationService.getApiConfiguration().pipe(
      map(appProperties => appProperties.apiUrl),
      map(apiUrl => req.clone({ url: apiUrl + req.url })),
      flatMap(apiReq => next.handle(apiReq))
    );
  }

}
