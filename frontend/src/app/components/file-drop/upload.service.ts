import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UploadService {

  constructor(private http: HttpClient) {}

  uploadFile(fileContent: any, fileName: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', fileContent, fileName);
    return this.http.post<any>('/rest/transactions', formData);
  }

}
