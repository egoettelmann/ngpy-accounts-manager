import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroupedValue } from '@core/models/domain.models';
import { ClrIconModule, ClrStackViewModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ToCategoryPipe } from '@shared/pipes/to-category.pipe';
import { CommonModule } from '@angular/common';
import { ToLabelPipe } from '@shared/pipes/to-label.pipe';
import { ClarityIcons, detailsIcon, popOutIcon } from '@cds/core/icon';

@Component({
  standalone: true,
  selector: 'app-analytics-details-table',
  templateUrl: './analytics-details-table.component.html',
  styleUrls: ['./analytics-details-table.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    ClrStackViewModule,
    ClrIconModule,
    ToCategoryPipe,
    ToLabelPipe
  ]
})
export class AnalyticsDetailsTableComponent {

  @Input() data?: GroupedValue[];
  @Input() expanded = true;

  @Output() categoryClick = new EventEmitter<number>();
  @Output() labelClick = new EventEmitter<number>();

  constructor() {
    ClarityIcons.addIcons(detailsIcon, popOutIcon);
  }

  clickOnCategory(categoryId: number): void {
    this.categoryClick.emit(categoryId);
  }

  clickOnLabel(labelId: number): void {
    this.labelClick.emit(labelId);
  }

}
