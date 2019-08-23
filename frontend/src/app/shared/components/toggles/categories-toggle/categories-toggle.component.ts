import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Category } from '../../../../core/models/api.models';
import * as _ from 'lodash';

/**
 * The category toggle component
 */
@Component({
  selector: 'app-categories-toggle',
  templateUrl: './categories-toggle.component.html'
})
export class CategoriesToggleComponent implements OnChanges {

  /**
   * The available categories
   */
  @Input() categories: Category[];

  /**
   * The selected values
   */
  @Input() value: number[] = [];

  /**
   * Triggered on each selection change
   */
  @Output() onChange = new EventEmitter<number[]>();

  /**
   * The currently selected categories
   */
  selectedCategories: number[];

  /**
   * Triggered on each input change.
   *
   * @param changes the input changes
   */
  ngOnChanges(changes) {
    if (this.value && changes.value !== undefined) {
      if (this.value.length === 0) {
        this.toggleAllCategories();
      } else {
        this.toggleCategories(this.value);
      }
    }
    if (changes.categories && this.categories) {
      if (this.selectedCategories === undefined || this.selectedCategories.length === 0) {
        this.toggleAllCategories();
      } else {
        this.toggleCategories(this.selectedCategories);
      }
    }
  }

  /**
   * Checks if a category id is selected.
   *
   * @param categoryId the category id to check
   */
  isSelected(categoryId: number): boolean {
    if (this.selectedCategories) {
      return this.selectedCategories.indexOf(categoryId) > -1;
    }
    return false;
  }

  /**
   * Toggles a category by its id.
   *
   * @param categoryId the category id to toggle
   */
  toggleCategory(categoryId: number) {
    if (this.selectedCategories === undefined) {
      this.selectedCategories = [];
    }
    if (this.isSelected(categoryId)) {
      const idx = this.selectedCategories.indexOf(categoryId);
      if (this.selectedCategories.length > 1) {
        this.selectedCategories.splice(idx, 1);
      }
    } else {
      this.selectedCategories.push(categoryId);
    }
    this.onChange.emit(this.selectedCategories);
  }

  /**
   * Toggles all categories
   */
  toggleAllCategories() {
    if (this.selectedCategories !== undefined) {
      this.selectedCategories = undefined;
      this.onChange.emit(this.selectedCategories);
    }
  }

  /**
   * Toggles a list of categories.
   *
   * @param categories the categories to toggle
   */
  toggleCategories(categories: number[]) {
    const selectedCategories = categories.slice(0);
    if (!_.isEqual(selectedCategories, this.selectedCategories)) {
      this.selectedCategories = selectedCategories;
      this.onChange.emit(this.selectedCategories);
    }
  }

}
