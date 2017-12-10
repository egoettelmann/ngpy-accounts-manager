import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Label } from './label';

@Injectable()
export class LabelsService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Label[]> {
    return this.http.get<Label[]>('/rest/labels');
  }

}
