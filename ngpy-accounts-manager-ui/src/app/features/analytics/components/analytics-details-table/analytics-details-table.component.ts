import { Component, Input } from '@angular/core';
import { GroupedValue } from '../../../../core/models/domain.models';

@Component({
  selector: 'app-analytics-details-table',
  templateUrl: './analytics-details-table.component.html',
  styleUrls: ['./analytics-details-table.component.scss']
})
export class AnalyticsDetailsTableComponent {

  @Input() data: GroupedValue[];
  @Input() expanded = true;

}
