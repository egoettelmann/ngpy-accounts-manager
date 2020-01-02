import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../models/api.models';
import { EventBusService } from '../event-bus.service';
import { flatMap, shareReplay, startWith, tap } from 'rxjs/operators';

/**
 * The categories rest service
 */
@Injectable()
export class CategoriesRestService {

  private categories: Observable<Category[]>;

  /**
   * Instantiates the service.
   *
   * @param http the HTTP client
   * @param eventBusService the event bus service
   */
  constructor(private http: HttpClient,
              private eventBusService: EventBusService
  ) {
  }

  /**
   * Gets all categories
   */
  getAll(): Observable<Category[]> {
    return this.eventBusService.accept(['categories.*']).pipe(
      startWith(0),
      flatMap(() => this.loadCategories())
    );
  }

  /**
   * Saves a category.
   *
   * @param category the category to save
   */
  saveOne(category: Category) {
    return this.http.post('/rest/categories', category).pipe(
      tap(() => this.resetCache()),
      tap(() => this.eventBusService.publish('categories.update', category))
    );
  }

  /**
   * Deletes a category.
   *
   * @param categoryId the category id to delete
   */
  deleteOne(categoryId: number) {
    return this.http.delete('/rest/categories/' + categoryId).pipe(
      tap(() => this.resetCache()),
      tap(() => this.eventBusService.publish('categories.delete', categoryId))
    );
  }

  /**
   * Load the categories (from the cache if available)
   */
  private loadCategories(): Observable<Category[]> {
    if (this.categories == null) {
      this.categories = this.http.get<Category[]>('/rest/categories').pipe(
        shareReplay(1)
      );
    }
    return this.categories;
  }

  /**
   * Resets the cache
   */
  private resetCache() {
    this.categories = undefined;
  }

}
