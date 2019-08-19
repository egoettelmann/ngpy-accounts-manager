import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Account, Category, Label } from '../../../core/models/api.models';
import { FilterOperator, FilterRequest } from '../../../core/models/rql.models';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RqlService } from '../../../core/services/rql.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private rqlService: RqlService
  ) {}

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.buildForm();
    this.registerFormChanges();
    this.initFormData();
  }

  /**
   * Triggered when the component is destroyed.
   */
  ngOnDestroy(): void {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

  /**
   * Changes the selected accounts.
   *
   * @param accounts the selected accounts
   */
  changeAccounts(accounts: number[]) {
    const accountIds = accounts.length === 0 ? null : accounts;
    this.searchForm.get('accounts').setValue(accountIds);
  }

  /**
   * Changes the selected labels.
   *
   * @param labelIds the selected label ids
   */
  changeLabels(labelIds: number[]) {
    this.searchForm.get('labels').setValue(labelIds);
  }

  /**
   * Changes the selected categories.
   *
   * @param categoryIds the selected category ids
   */
  changeCategories(categoryIds: number[]) {
    this.searchForm.get('categories').setValue(categoryIds);
  }

  /**
   * Changes the date.
   *
   * @param field the field (minDate or maxDate)
   * @param value the new date
   */
  changeDate(field: string, value: Date) {
    this.searchForm.get(field).setValue(value);
  }

  /**
   * Builds the form
   */
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

  /**
   * Registers the value change listeners on the form
   */
  private registerFormChanges() {
    this.changeSubscription = this.searchForm.valueChanges.pipe(
      debounceTime(200)
    ).subscribe(value => {
      const filterRequest = this.buildFilterRequest(value);
      if (filterRequest) {
        this.searchChange.emit(filterRequest);
      }
      this.updateRouteParams();
    });
  }

  /**
   * Init the form with the route query params
   */
  private initFormData() {
    const queryParams = this.route.snapshot.queryParamMap;
    const formData = {} as any;
    if (queryParams.has('minDate')) {
      const dateArr = queryParams.get('minDate').split('-');
      formData.minDate = new Date(+dateArr[0], +dateArr[1], +dateArr[2]);
    }
    if (queryParams.has('maxDate')) {
      const dateArr = queryParams.get('maxDate').split('-');
      formData.maxDate = new Date(+dateArr[0], +dateArr[1], +dateArr[2]);
    }
    formData.minAmount = queryParams.get('minAmount');
    formData.maxAmount = queryParams.get('maxAmount');
    if (queryParams.has('accounts')) {
      formData.accounts = queryParams.get('accounts')
        .split(',')
        .map(a => +a);
    }
    if (queryParams.has('labels')) {
      formData.labels = queryParams.get('labels')
        .split(',')
        .map(a => a === '' ? null : +a);
    }
    if (queryParams.has('categories')) {
      formData.categories = queryParams.get('categories')
        .split(',')
        .map(a => a === '' ? null : +a);
    }
    formData.description = queryParams.get('description');
    this.searchForm.patchValue(formData);
  }

  /**
   * Update the route params with the form data
   */
  private updateRouteParams() {
    const accounts = this.searchForm.get('accounts').value ? this.searchForm.get('accounts').value.join(',') : undefined;
    const labels = this.searchForm.get('labels').value ? this.searchForm.get('labels').value.join(',') : undefined;
    const categories = this.searchForm.get('categories').value ? this.searchForm.get('categories').value.join(',') : undefined;
    const minDate = this.searchForm.get('minDate').value ? this.rqlService.formatDate(this.searchForm.get('minDate').value) : undefined;
    const maxDate = this.searchForm.get('maxDate').value ? this.rqlService.formatDate(this.searchForm.get('maxDate').value) : undefined;
    const queryParams = {
      'accounts': accounts,
      'labels': labels,
      'categories': categories,
      'minDate': minDate,
      'maxDate': maxDate,
      'minAmount': this.searchForm.get('minAmount').value,
      'maxAmount': this.searchForm.get('maxAmount').value,
      'description': this.searchForm.get('description').value
    };
    this.router.navigate(['search'], {
      queryParams: queryParams
    });
  }

  /**
   * Builds the filter request.
   *
   * @param formData the form data
   */
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
    if (formData.minAmount != null && formData.minAmount != '') {
      filters.push(FilterRequest.of('amount', formData.minAmount, FilterOperator.GE));
    }

    // Adding the min amount
    if (formData.maxAmount != null && formData.maxAmount != '') {
      filters.push(FilterRequest.of('amount', formData.maxAmount, FilterOperator.LT));
    }

    // Adding the description
    if (formData.description && formData.description.trim() != '') {
      filters.push(FilterRequest.of('description', formData.description, FilterOperator.CT));
    }

    if (filters.length === 0) {
      return undefined;
    }
    return FilterRequest.all(...filters);
  }

}
