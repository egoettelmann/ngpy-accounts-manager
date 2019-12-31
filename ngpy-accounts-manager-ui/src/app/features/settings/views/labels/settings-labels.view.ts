import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { combineLatest, Subscription } from 'rxjs';
import { lock, SubscriptionLock } from '../../../../shared/utils/lock-subscriber';
import { Category, Label } from '../../../../core/models/api.models';
import { CategoriesService } from '../../../../core/services/domain/categories.service';
import { LabelsService } from '../../../../core/services/domain/labels.service';

@Component({
  templateUrl: './settings-labels.view.html',
  styleUrls: ['./settings-labels.view.scss']
})
export class SettingsLabelsView implements OnInit, OnDestroy {

  @HostBinding('class') hostClass = 'content-area';

  categories: Category [];
  form: FormGroup;
  formArray: FormArray;

  private subscriptions = {
    static: new Subscription(),
    active: new Subscription()
  };

  constructor(private fb: FormBuilder,
              private labelsService: LabelsService,
              private categoriesService: CategoriesService) {
  }

  ngOnInit(): void {
    const sub = combineLatest([
      this.categoriesService.getCategories(),
      this.labelsService.getLabels()
    ]).subscribe(([categories, labels]) => {
      this.categories = categories;
      this.buildForm(labels.slice(0));
    });
    this.subscriptions.static.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.static.unsubscribe();
    this.subscriptions.active.unsubscribe();
  }

  deleteLabel(label: Label) {
    this.labelsService.deleteOne(label).subscribe();
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
