import { Component, OnInit } from '@angular/core';
import { AppProperties } from '../../models/api.models';
import { ConfigurationService } from '@core/services/configuration.service';

/**
 * The main component
 */
@Component({
  templateUrl: './main.view.html',
  styleUrls: ['./main.view.scss']
})
export class MainView implements OnInit {

  /**
   * The application properties
   */
  public appProperties?: AppProperties;

  /**
   * Instantiates the component.
   *
   * @param configurationService the configuration service
   */
  constructor(private configurationService: ConfigurationService) {
  }

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.configurationService.getApiProperties().subscribe(data => {
      this.appProperties = data;
    });
  }

}
