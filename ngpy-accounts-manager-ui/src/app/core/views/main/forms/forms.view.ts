import { Component, OnInit } from '@angular/core';
import { SessionRestService } from '../../../services/rest/session-rest.service';

/**
 * The main component
 */
@Component({
  templateUrl: './forms.view.html',
  styleUrls: ['./forms.view.scss']
})
export class FormsView implements OnInit {

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
  }

}
