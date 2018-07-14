import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelsService } from '../../../../services/labels.service';
import { Label } from '../../../../components/transactions/label';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Category } from '../../../../components/transactions/category';
import { CategoriesService } from '../../../../services/categories.service';
import { zip } from 'rxjs/observable/zip';

@Component({
  templateUrl: './settings-labels-view.component.html',
  styleUrls: ['./settings-labels-view.component.scss']
})
export class SettingsLabelsViewComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  categories: Category[];
  form: FormGroup;
  formArray: FormArray;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private labelsService: LabelsService,
              private categoriesService: CategoriesService) {
  }

  ngOnInit(): void {
    zip(
      this.categoriesService.getAll(),
      this.labelsService.getAll()
    ).subscribe(([categories, labels]) => {
      this.categories = categories;
      this.buildForm(labels.slice(0));
    });
  }

  deleteLabel(label: Label) {
    this.labelsService.deleteOne(label).subscribe(() => {
      this.ngOnInit();
    });
  }

  private buildForm(labels: Label[]) {
    this.form = this.fb.group({
      'labels': this.fb.array([])
    });
    this.formArray = this.form.get('labels') as FormArray;
    labels.map(label => {
      const control = this.buildFormControl(label);
      this.formArray.push(control);
    });
  }

  private buildFormControl(label: Label): FormGroup {
    const formGroup = this.fb.group({
      'id': [label.id],
      'name': [label.name],
      'color': [label.color],
      'icon': [label.icon],
      'category_id': [label.category.id],
      'numTransactions': [{value: label.numTransactions, disabled: true}]
    });

    formGroup.valueChanges.pipe(
      debounceTime(100)
    ).subscribe(value => {
      this.onFormChange(value);
    });

    return formGroup;
  }

  private onFormChange(value: Label) {
    this.labelsService.saveOne(value).subscribe();
  }

}