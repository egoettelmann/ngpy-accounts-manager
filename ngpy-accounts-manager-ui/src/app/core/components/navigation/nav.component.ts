import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SessionRestService } from '../../services/rest/session-rest.service';
import { AlertsService } from '../../services/domain/alerts.service';
import { Subscription } from 'rxjs';
import { RouterPathPipe } from '../../../shared/modules/router-path/router-path.pipe';
import { RouterService } from '../../services/router.service';

/**
 * The navigation component
 */
@Component({
  selector: 'app-navigation',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  /**
   * The reference to the search input element
   */
  @ViewChild('searchInput', { static: false }) searchInput: ElementRef;

  /**
   * The number of alerts
   */
  numAlerts: string;

  /**
   * The alert subscription
   */
  private alertsSubscription: Subscription;

  /**
   * Instantiates the component.
   *
   * @param routerService the router service
   * @param routerPathPipe the router path pipe
   * @param sessionService the session service
   * @param alertsService the alerts service
   */
  constructor(
    private routerService: RouterService,
    private routerPathPipe: RouterPathPipe,
    private sessionService: SessionRestService,
    private alertsService: AlertsService
  ) {
  }

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.alertsService.alertChanges.subscribe(alerts => {
      const numAlerts = alerts.debits + alerts.credits + alerts.labels;
      if (numAlerts > 0) {
        this.numAlerts = numAlerts.toString();
      }
      if (numAlerts < 0 || numAlerts > 99) {
        this.numAlerts = '99+';
      }
    });
  }

  /**
   * Triggered when the component is destroyed
   */
  ngOnDestroy(): void {
    if (this.alertsSubscription) {
      this.alertsSubscription.unsubscribe();
    }
  }

  /**
   * Handles the click on the logout button
   */
  clickLogout(): void {
    this.sessionService.logout().subscribe(() => {
      this.routerService.navigate('route.login');
    });
  }

  /**
   * Triggers the search.
   *
   * @param value the value to search
   */
  search(value: string) {
    this.routerService.navigate('route.transactions.search', {}, {
      queryParams: {
        description: value
      }
    });
    this.searchInput.nativeElement.value = '';
  }

}
