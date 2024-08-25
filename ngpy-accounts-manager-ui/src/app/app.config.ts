import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routes';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppRouterModule } from '@shared/modules/app-router/app-router.module';
import { AppRoutePaths } from '@core/app-route-paths';
import { AppKeepFocusModule } from '@shared/modules/keep-focus/app-keep-focus.module';
import { apiUrlInterceptor } from '@core/interceptors/api-url.interceptor';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function TranslateHttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(
      withInterceptors([
        apiUrlInterceptor,
        authInterceptor,
        errorInterceptor
      ])
    ),
    importProvidersFrom([
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: TranslateHttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
      AppRouterModule.forRoot({
        paths: AppRoutePaths,
        defaultRoute: ['root', 'main', 'dashboard']
      }),
      AppKeepFocusModule.forRoot()
    ])
  ]
};
