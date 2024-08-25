import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

/**
 * The app component
 */
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet]
})
export class AppComponent {

  /**
   * Instantiates the component.
   *
   * @param translateService the translate service
   */
  constructor(
    private translateService: TranslateService
  ) {
    translateService.setDefaultLang('en');
    translateService.use('en');
  }

}
