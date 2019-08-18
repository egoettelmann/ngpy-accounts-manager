import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Category } from '../../../../core/models/api.models';
import * as _ from 'lodash';

@Component({
  selector: 'app-category-toggle',
  templateUrl: './category-toggle.component.html'
})
export class CategoryToggleComponent implements OnChanges {

  @Input() categories: Category[];
  @Input() value: number[] = [];
  @Output() onChange = new EventEmitter<number[]>();

  selectedCategories: number[];

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

  isSelected(categoryId: number): boolean {
    if (this.selectedCategories) {
      return this.selectedCategories.indexOf(categoryId) > -1;
    }
    return false;
  }

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

  toggleAllCategories() {
    if (this.selectedCategories !== undefined) {
      this.selectedCategories = undefined;
      this.onChange.emit(this.selectedCategories);
    }
  }

  toggleCategories(categories: number[]) {
    const selectedCategories = categories.slice(0);
    if (!_.isEqual(selectedCategories, this.selectedCategories)) {
      this.selectedCategories = selectedCategories;
      this.onChange.emit(this.selectedCategories);
    }
  }

}
