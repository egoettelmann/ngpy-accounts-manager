import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Category } from '../../../../core/models/api.models';
import { CategoriesService } from '../../../../core/services/domain/categories.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './settings-categories.view.html',
  styleUrls: ['./settings-categories.view.scss']
})
export class SettingsCategoriesView implements OnInit, OnDestroy {

  @HostBinding('class') hostClass = 'content-area';

  form: FormGroup;
  formArray: FormArray;

  private subscriptions = {
    static: new Subscription(),
    active: new Subscription()
  };

  constructor(private fb: FormBuilder,
              private categoriesService: CategoriesService) {
  }

  ngOnInit(): void {
    const sub = this.categoriesService.getCategories().subscribe(categories => {
      this.buildForm(categories);
    });
    this.subscriptions.static.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.static.unsubscribe();
    this.subscriptions.active.unsubscribe();
  }

  deleteCategory(category: Category) {
    this.categoriesService.deleteOne(category).subscribe();
  }

  private buildForm(categories: Category[]) {
    this.form = this.fb.group({
      'categories': this.fb.array([])
    });
    this.formArray = this.form.get('categories') as FormArray;
    categories.map(category => {
      const control = this.buildFormControl(category);
      this.formArray.push(control);
    });
  }

  private buildFormControl(category: Category): FormGroup {
    const formGroup = this.fb.group({
      'id': [category.id],
      'name': [category.name],
      'type': [category.type],
      'color': [category.color],
      'numLabels': [{ value: category.numLabels, disabled: true }]
    });

    formGroup.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.onFormChange(value);
    });

    return formGroup;
  }

  private onFormChange(value: Category) {
    this.categoriesService.saveOne(value).subscribe();
  }

}
