import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * The app component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  /**
   * Instantiates the component.
   *
   * @param translateService the translate service
   */
  constructor(private translateService: TranslateService) {
    translateService.setDefaultLang('en');
    translateService.use('en');
  }

}
