import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Label } from '@core/models/api.models';
import * as _ from 'lodash';

/**
 * The label toggle component
 */
@Component({
  selector: 'app-labels-toggle',
  templateUrl: './labels-toggle.component.html'
})
export class LabelsToggleComponent implements OnChanges {

  /**
   * The available labels
   */
  @Input() labels?: Label[];

  /**
   * The currently selected values
   */
  @Input() value: number[] = [];

  /**
   * Triggered on selection change
   */
  @Output() onChange = new EventEmitter<(number | null)[]>();

  /**
   * The currently selected labels
   */
  selectedLabels?: (number | null)[];

  /**
   * Handles all input changes.
   *
   * @param changes the input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.value && changes.value !== undefined) {
      if (this.value.length === 0) {
        this.toggleAllLabels();
      } else {
        this.toggleLabels(this.value);
      }
    }
    if (changes.labels && this.labels) {
      if (this.selectedLabels === undefined || this.selectedLabels.length === 0) {
        this.toggleAllLabels();
      } else {
        this.toggleLabels(this.selectedLabels);
      }
    }
  }

  /**
   * Checks if a label id is selected.
   *
   * @param labelId the label id
   */
  isSelected(labelId: number | null): boolean {
    if (this.selectedLabels) {
      return this.selectedLabels.indexOf(labelId) > -1;
    }
    return false;
  }

  /**
   * Toggles a label by its id.
   *
   * @param labelId the label id
   */
  toggleLabel(labelId: number | null): void {
    if (this.selectedLabels === undefined) {
      this.selectedLabels = [];
    }
    if (this.isSelected(labelId)) {
      const idx = this.selectedLabels.indexOf(labelId);
      if (this.selectedLabels.length > 1) {
        this.selectedLabels.splice(idx, 1);
      }
    } else {
      this.selectedLabels.push(labelId);
    }
    this.onChange.emit(this.selectedLabels);
  }

  /**
   * Toggles all labels
   */
  toggleAllLabels(): void {
    if (this.selectedLabels !== undefined) {
      this.selectedLabels = undefined;
      this.onChange.emit(this.selectedLabels);
    }
  }

  /**
   * Toggles the provided labels.
   *
   * @param labels the labels to toggle
   */
  toggleLabels(labels: (number | null)[]): void {
    const selectedLabels = labels.slice(0);
    if (!_.isEqual(selectedLabels, this.selectedLabels)) {
      this.selectedLabels = selectedLabels;
      this.onChange.emit(this.selectedLabels);
    }
  }

}
