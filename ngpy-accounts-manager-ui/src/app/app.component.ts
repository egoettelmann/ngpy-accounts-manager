import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationService } from './core/services/configuration.service';

/**
 * The app component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  /**
   * Instantiates the component.
   *
   * @param configurationService the configuration service
   * @param translateService the translate service
   */
  constructor(
    private configurationService: ConfigurationService,
    private translateService: TranslateService
  ) {
    translateService.setDefaultLang('en');
    translateService.use('en');
  }

  ngOnInit(): void {
    this.configurationService.getAppProperties().subscribe(data => {
      console.log('appProperties', data);
    });
  }

}
