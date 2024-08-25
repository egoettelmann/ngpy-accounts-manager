import { Component, OnInit } from '@angular/core';
import { AppProperties } from '../../models/api.models';
import { ConfigurationService } from '@core/services/configuration.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationModalComponent } from '@shared/components/modals/notification/notification-modal.component';
import { ClrMainContainerModule } from '@clr/angular';
import { NavComponent } from '@core/components/navigation/nav.component';

/**
 * The main component
 */
@Component({
  standalone: true,
  templateUrl: './main.view.html',
  styleUrls: ['./main.view.scss'],
  imports: [
    RouterOutlet,
    CommonModule,
    ClrMainContainerModule,
    NavComponent,
    NotificationModalComponent,
  ]
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
