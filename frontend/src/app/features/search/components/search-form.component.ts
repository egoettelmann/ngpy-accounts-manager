import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Account, Category, Label } from '../../../core/models/api.models';
import { FilterOperator, FilterRequest } from '../../../core/models/rql.models';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RqlService } from '../../../core/services/rql.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit, OnDestroy {

  @Input() accounts: Account[];
  @Input() labels: Label[];
  @Input() categories: Category[];

  @Output() searchChange = new EventEmitter<FilterRequest>();

  searchForm: FormGroup;

  private changeSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private rqlService: RqlService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.registerFormChanges();
  }

  ngOnDestroy(): void {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

  changeAccounts(accounts: Account[]) {
    const accountIds = accounts.length === this.accounts.length ? null : accounts.map(a => a.id);
    this.searchForm.get('accounts').setValue(accountIds);
  }

  changeLabels(labelIds: number[]) {
    this.searchForm.get('labels').setValue(labelIds);
  }

  changeCategories(categoryIds: number[]) {
    this.searchForm.get('categories').setValue(categoryIds);
  }

  changeDate(field: string, value: Date) {
    this.searchForm.get(field).setValue(value);
  }

  private buildForm() {
    this.searchForm = this.fb.group({
      'accounts': [null],
      'labels': [null],
      'categories': [null],
      'minDate': [null],
      'maxDate': [null],
      'minAmount': [null],
      'maxAmount': [null],
      'description': [null]
    });
  }

  private registerFormChanges() {
    this.changeSubscription = this.searchForm.valueChanges.pipe(
      debounceTime(200)
    ).subscribe(value => {
      const filterRequest = this.buildFilterRequest(value);
      if (filterRequest) {
        this.searchChange.emit(filterRequest);
      }
    });
  }

  private buildFilterRequest(formData: any): FilterRequest {
    const filters: FilterRequest[] = [];

    // Adding the accounts
    if (formData.accounts && formData.accounts.length > 0) {
      const accounts = this.rqlService.formatList(formData.accounts);
      filters.push(FilterRequest.of('accountId', accounts, FilterOperator.IN));
    }

    // Adding the labels
    if (formData.labels && formData.labels.length > 0) {
      const labels = this.rqlService.formatList(formData.labels);
      filters.push(FilterRequest.of('labelId', labels, FilterOperator.IN));
    }

    // Adding the categories
    if (formData.categories && formData.categories.length > 0) {
      const categories = this.rqlService.formatList(formData.categories);
      filters.push(FilterRequest.of('categoryId', categories, FilterOperator.IN));
    }

    // Adding the min date
    if (formData.minDate != null) {
      const minDate = this.rqlService.formatDate(formData.minDate);
      filters.push(FilterRequest.of('dateValue', minDate, FilterOperator.GE));
    }

    // Adding the max date
    if (formData.maxDate != null) {
      const maxDate = this.rqlService.formatDate(formData.maxDate);
      filters.push(FilterRequest.of('dateValue', maxDate, FilterOperator.LT));
    }

    // Adding the min amount
    if (formData.minAmount != null) {
      filters.push(FilterRequest.of('amount', formData.minAmount, FilterOperator.GE));
    }

    // Adding the min amount
    if (formData.maxAmount != null) {
      filters.push(FilterRequest.of('amount', formData.maxAmount, FilterOperator.LT));
    }

    // Adding the description
    if (formData.description && formData.description.trim() !== '') {
      filters.push(FilterRequest.of('description', formData.description, FilterOperator.CT));
    }

    if (filters.length === 0) {
      return undefined;
    }
    return FilterRequest.all(...filters);
  }

}
