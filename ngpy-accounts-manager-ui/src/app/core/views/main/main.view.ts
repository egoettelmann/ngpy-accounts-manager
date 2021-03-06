import { Component, OnInit } from '@angular/core';
import { SessionRestService } from '../../services/rest/session-rest.service';
import { AppProperties } from '../../models/api.models';

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
  public appProperties: AppProperties;

  /**
   * Instantiates the component.
   *
   * @param sessionRestService the session rest service
   */
  constructor(private sessionRestService: SessionRestService) {
  }

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.sessionRestService.getProperties().subscribe(data => {
      this.appProperties = data;
    });
  }

}
