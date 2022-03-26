import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Category } from '../../core/models/api.models';
import { Subscription } from 'rxjs';
import { CategoriesService } from '../../core/services/domain/categories.service';

/**
 * The category name pipe.
 * Transforms a category id into its name.
 */
@Pipe({
  name: 'toCategory',
  pure: false
})
export class ToCategoryPipe implements PipeTransform, OnDestroy {

  /**
   * The available categories
   */
  private categories: Category[];

  /**
   * The subscription
   */
  private subscription: Subscription;

  /**
   * Instantiates the pipe.
   *
   * @param categoriesService the categories service
   */
  constructor(private categoriesService: CategoriesService) {
    this.subscription = this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  /**
   * Destroys the pipe
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Transforms a provided category id into a category name.
   *
   * @param categoryId the category id
   * @param attribute the attribute
   */
  transform(categoryId: number, attribute?: string): string {
    if (this.categories == null) {
      return this.getAttribute(
        this.defaultCategory(categoryId),
        attribute
      );
    }

    const category = this.categories.find(c => c.id === categoryId);
    if (category == null) {
      return this.getAttribute(
        this.defaultCategory(categoryId),
        attribute
      );
    }

    return this.getAttribute(category, attribute);
  }

  /**
   * The default category.
   *
   * @param categoryId the category id
   */
  private defaultCategory(categoryId: number): Category {
    return {
      id: categoryId,
      name: ''
    };
  }

  /**
   * Extracts an attribute from the category.
   *
   * @param category the category
   * @param attribute the attribute to extract
   */
  private getAttribute(category: Category, attribute: string): any {
    if (attribute == null) {
      return category;
    }
    if (category.hasOwnProperty(attribute)) {
      return category[attribute];
    }
    return null;
  }

}
