import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UploadService {

  constructor(private http: HttpClient) {}

  uploadFile(fileContent: any, fileName: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', fileContent, fileName);
    console.log('fileContent', fileContent, fileName);
    console.log('formData', formData);
    return this.http.post<any>('/rest/transactions', formData).toPromise();
  }

}
