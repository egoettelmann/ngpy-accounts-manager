import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Category } from '../../models/category';

@Injectable()
export class CategoriesRestService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>('/rest/categories');
  }

  saveOne(category: Category) {
    return this.http.post('/rest/categories', category);
  }

  deleteOne(category: Category) {
    return this.http.delete('/rest/categories/' + category.id);
  }
}
