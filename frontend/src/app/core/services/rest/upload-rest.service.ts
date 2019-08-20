import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * The upload rest service.
 */
@Injectable()
export class UploadRestService {

  /**
   * Instantiates the service.
   *
   * @param http the HTTP client
   */
  constructor(private http: HttpClient) {}

  /**
   * Uploads a file containing transactions.
   *
   * @param fileContent the file to upload
   * @param fileName the file name
   */
  uploadFile(fileContent: any, fileName: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', fileContent, fileName);
    return this.http.post<any>('/rest/transactions/upload-file', formData);
  }

}
