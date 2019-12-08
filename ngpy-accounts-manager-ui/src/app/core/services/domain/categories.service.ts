import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../models/api.models';
import { CategoriesRestService } from '../rest/categories-rest.service';
import { map } from 'rxjs/operators';

/**
 * The categories service
 */
@Injectable()
export class CategoriesService {

  /**
   * Instantiates the service.
   *
   * @param categoriesRestService the categories rest service
   */
  constructor(private categoriesRestService: CategoriesRestService) {
  }

  /**
   * Gets all categories.
   */
  getCategories(): Observable<Category[]> {
    return this.categoriesRestService.getAll();
  }

  /**
   * Gets all categories of a type.
   *
   * @param type the category type
   */
  getCategoriesOfType(type: string): Observable<Category[]> {
    return this.categoriesRestService.getAll().pipe(
      map(o => o.filter(c => c.type === type))
    );
  }

  /**
   * Deletes a category.
   *
   * @param category the category to delete
   */
  deleteOne(category: Category) {
    return this.categoriesRestService.deleteOne(category.id);
  }

  /**
   * Saves a category.
   *
   * @param category the category to save
   */
  saveOne(category: Category) {
    return this.categoriesRestService.saveOne(category);
  }

}
