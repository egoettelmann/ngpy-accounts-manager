import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Label } from '../../../../core/models/api.models';

@Component({
  selector: 'app-label-toggle',
  templateUrl: './label-toggle.component.html'
})
export class LabelToggleComponent implements OnChanges {

  @Input() labels: Label[];
  @Input() value: number[] = [];
  @Output() onChange = new EventEmitter<number[]>();

  selectedLabels: number[];

  ngOnChanges(changes) {
    if (this.value && changes.value) {
      this.selectedLabels = this.value.slice(0);
    }
  }

  isSelected(labelId: number): boolean {
    if (this.selectedLabels) {
      return this.selectedLabels.indexOf(labelId) > -1;
    }
    return false;
  }

  toggleLabel(labelId: number) {
    if (this.selectedLabels && this.isSelected(labelId)) {
      const idx = this.selectedLabels.indexOf(labelId);
      if (this.selectedLabels.length > 1) {
        this.selectedLabels.splice(idx, 1);
      }
    } else {
      if (this.selectedLabels === undefined) {
        this.selectedLabels = [];
      }
      this.selectedLabels.push(labelId);
    }
    this.onChange.emit(this.selectedLabels);
  }

  toggleAllLabels() {
    this.selectedLabels = undefined;
    this.onChange.emit(this.selectedLabels);
  }

}
