import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventBusService } from '../event-bus.service';
import { tap } from 'rxjs/operators';

/**
 * The upload rest service.
 */
@Injectable()
export class UploadRestService {

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
   * Uploads a file containing transactions.
   *
   * @param fileContent the file to upload
   * @param fileName the file name
   */
  uploadFile(fileContent: any, fileName: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', fileContent, fileName);
    return this.http.post<any>('/rest/transactions/upload-file', formData).pipe(
      tap(() => this.eventBusService.publish('transactions.upload', fileName))
    );
  }

}
