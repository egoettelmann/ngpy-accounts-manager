import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../../../services/categories.service';
import { Category } from '../../../../components/transactions/category';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  templateUrl: './settings-categories-view.component.html',
  styleUrls: ['./settings-categories-view.component.scss']
})
export class SettingsCategoriesViewComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  form: FormGroup;
  formArray: FormArray;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private categoriesService: CategoriesService) {
  }

  ngOnInit(): void {
    this.categoriesService.getAll().subscribe(categories => {
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
      'type': [category.type]
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
