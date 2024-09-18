import { Injectable, OnDestroy } from '@angular/core';
import { format } from 'date-fns';
import { TranslateService } from '@ngx-translate/core';
import { formatNumber } from '@angular/common';
import { Category, Label } from '@core/models/api.models';
import { Subscription } from 'rxjs';
import { CategoriesService } from '@core/services/domain/categories.service';
import { LabelsService } from '@core/services/domain/labels.service';

/**
 * The Date service
 */
@Injectable({ providedIn: 'root' })
export class FormatService implements OnDestroy {

  /**
   * The available labels
   */
  private labels?: Label[];

  /**
   * The available categories
   */
  private categories?: Category[];

  /**
   * The subscription for labels
   */
  private labels$: Subscription;

  /**
   * The subscription for categories
   */
  private categories$: Subscription;

  constructor(private translateService: TranslateService,
              private categoriesService: CategoriesService,
              private labelsService: LabelsService) {
    this.categories$ = this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    this.labels$ = this.labelsService.getLabels().subscribe(labels => {
      this.labels = labels;
    });
  }

  ngOnDestroy(): void {
    this.categories$.unsubscribe();
    this.labels$.unsubscribe();
  }

  /**
   * Formats a date.
   *
   * @param date the date to format
   */
  formatDate(date?: Date | null): string {
    if (date == null) {
      return '';
    }
    const dateFormat = this.translateService.instant('i18n.format.date');
    return format(date, dateFormat);
  }

  /**
   * Formats a decimal number.
   *
   * @param value the value to format
   */
  formatNumber(value?: number | null): string {
    if (value == null) {
      return '';
    }
    const numberFormat = this.translateService.instant('i18n.format.number');
    return formatNumber(value, this.translateService.currentLang, numberFormat);
  }

}
