import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../models/api.models';

/**
 * The categories rest service
 */
@Injectable()
export class CategoriesRestService {

  /**
   * Instantiates the service.
   *
   * @param http the HTTP client
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Gets all categories
   */
  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>('/rest/categories');
  }

  /**
   * Saves a category.
   *
   * @param category the category to save
   */
  saveOne(category: Category) {
    return this.http.post('/rest/categories', category);
  }

  /**
   * Deletes a category.
   *
   * @param categoryId the category id to delete
   */
  deleteOne(categoryId: number) {
    return this.http.delete('/rest/categories/' + categoryId);
  }
}
