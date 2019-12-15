import { Component, HostBinding, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Category } from '../../../../core/models/api.models';
import { CategoriesService } from '../../../../core/services/domain/categories.service';

@Component({
  templateUrl: './settings-categories.component.html',
  styleUrls: ['./settings-categories.component.scss']
})
export class SettingsCategoriesComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  form: FormGroup;
  formArray: FormArray;

  constructor(private fb: FormBuilder,
              private categoriesService: CategoriesService) {
  }

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe(categories => {
      this.buildForm(categories);
    });
  }

  deleteCategory(category: Category) {
    this.categoriesService.deleteOne(category).subscribe(() => {
      this.ngOnInit();
    });
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
      'numLabels': [{value: category.numLabels, disabled: true}]
    });

    formGroup.valueChanges.pipe(
      debounceTime(100)
    ).subscribe(value => {
      this.onFormChange(value);
    });

    return formGroup;
  }

  private onFormChange(value: Category) {
    this.categoriesService.saveOne(value).subscribe();
  }

}
