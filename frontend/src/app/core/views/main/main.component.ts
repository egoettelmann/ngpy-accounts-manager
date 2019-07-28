import { Component, OnInit } from '@angular/core';
import { SessionRestService } from '../../services/rest/session-rest.service';
import { AppProperties } from '../../models/api.models';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public appProperties: AppProperties;

  constructor(private sessionService: SessionRestService) {
  }

  ngOnInit(): void {
    this.sessionService.getProperties().subscribe(data => {
      this.appProperties = data;
    });
  }

}
