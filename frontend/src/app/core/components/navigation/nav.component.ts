import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SessionRestService } from '../../services/rest/session-rest.service';
import { Router } from '@angular/router';
import { AlertsService } from '../../services/domain/alerts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  @ViewChild('searchInput', { static: false }) searchInput: ElementRef;

  numAlerts: string;

  private alertsSubscription: Subscription;

  constructor(
    private router: Router,
    private sessionService: SessionRestService,
    private alertsService: AlertsService
  ) {
  }

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

  ngOnDestroy(): void {
    if (this.alertsSubscription) {
      this.alertsSubscription.unsubscribe();
    }
  }

  clickLogout(): void {
    this.sessionService.logout().subscribe(() => {
      this.router.navigate(['login']);
    });
  }

  search(value: string) {
    this.router.navigate(['search'], {
      queryParams: {
        description: value
      }
    });
    this.searchInput.nativeElement.value = '';
  }

}
