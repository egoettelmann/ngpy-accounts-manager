import { ModuleWithProviders, NgModule } from '@angular/core';
import { KeepFocusDirective } from '@shared/modules/keep-focus/keep-focus.directive';
import { KeepFocusService } from '@core/services/keep-focus.service';

/**
 * The router path module.
 *
 * This module declares the RouterPathPipe that helps to create router links.
 * The forRoot method should be called in the AppModule to declare the available route paths.
 */
@NgModule({
  imports: [
    KeepFocusDirective
  ],
  exports: [
    KeepFocusDirective
  ]
})
export class AppKeepFocusModule {

  /**
   * To be called in the AppModule to register all available route paths.
   */
  static forRoot(): ModuleWithProviders<AppKeepFocusModule> {
    return {
      ngModule: AppKeepFocusModule,
      providers: [
        {
          provide: KeepFocusService,
          useValue: new KeepFocusService()
        }
      ]
    };
  }

}
