import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Label } from '../components/transactions/label';
import { CommonFunctions } from '../common/common-functions';

@Injectable()
export class LabelsService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Label[]> {
    return this.http.get<Label[]>('/rest/labels');
  }

  deleteOne(label: Label) {
    return this.http.delete('/rest/labels/' + label.id);
  }

  saveOne(label: Label): Observable<Label> {
    return this.http.post<Label>('/rest/labels', CommonFunctions.removeEmpty(label));
  }

}
