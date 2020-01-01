import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroupedValue } from '../../../../core/models/domain.models';

@Component({
  selector: 'app-analytics-details-table',
  templateUrl: './analytics-details-table.component.html',
  styleUrls: ['./analytics-details-table.component.scss']
})
export class AnalyticsDetailsTableComponent {

  @Input() data: GroupedValue[];
  @Input() expanded = true;

  @Output() categoryClick = new EventEmitter<number>();
  @Output() labelClick = new EventEmitter<number>();

  clickOnCategory(categoryId: number) {
    this.categoryClick.emit(categoryId);
  }

  clickOnLabel(labelId: number) {
    this.labelClick.emit(labelId);
  }

}
