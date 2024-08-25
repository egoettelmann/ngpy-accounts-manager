import { Component, Input } from '@angular/core';
import { Account } from '@core/models/api.models';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ClrIconModule } from '@clr/angular';

/**
 * The account card component
 */
@Component({
  standalone: true,
  selector: 'app-dashboard-account-card',
  templateUrl: './dashboard-account-card.component.html',
  styleUrls: ['./dashboard-account-card.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    ClrIconModule
  ]
})
export class DashboardAccountCardComponent {

  /**
   * The account
   */
  @Input() account?: Account;

}
