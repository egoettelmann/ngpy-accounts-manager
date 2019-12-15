import { Component, HostBinding, OnInit } from '@angular/core';
import { LabelsRestService } from '../../../../core/services/rest/labels-rest.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { zip } from 'rxjs';
import { lock, SubscriptionLock } from '../../../../shared/utils/lock-subscriber';
import { Category, Label } from '../../../../core/models/api.models';
import { CategoriesService } from '../../../../core/services/domain/categories.service';

@Component({
  templateUrl: './settings-labels.component.html',
  styleUrls: ['./settings-labels.component.scss']
})
export class SettingsLabelsComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  categories: Category [];
  form: FormGroup;
  formArray: FormArray;

  constructor(private fb: FormBuilder,
              private labelsService: LabelsRestService,
              private categoriesService: CategoriesService) {
  }

  ngOnInit(): void {
    zip(
      this.categoriesService.getCategories(),
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

  addLabel() {
    const newLabel = {
      name: '',
      color: '',
      icon: '',
      numTransactions: 0
    } as Label;
    const control = this.buildFormControl(newLabel);
    this.formArray.push(control);
    this.onFormChange(control);
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
      'category_id': [label.category ? label.category.id : null],
      'numTransactions': [label.numTransactions]
    });
    this.disablePrivateFields(formGroup);

    const saveLock = new SubscriptionLock();
    formGroup.valueChanges.pipe(
      debounceTime(500),
      lock(saveLock)
    ).subscribe(() => {
      this.onFormChange(formGroup, saveLock);
    });

    return formGroup;
  }

  private onFormChange(formGroup: FormGroup, saveLock = new SubscriptionLock()) {
    const value = formGroup.value;
    this.labelsService.saveOne(value).subscribe(savedLabel => {
      formGroup.patchValue({ id: savedLabel.id }, { emitEvent: false });
      saveLock.release();
    });
  }

  private disablePrivateFields(formGroup: FormGroup) {
    formGroup.get('numTransactions').disable({ emitEvent: false });
  }

}
