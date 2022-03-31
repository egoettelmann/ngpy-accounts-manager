import { Component, NgZone, ViewEncapsulation } from '@angular/core';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { UploadRestService } from '../../../../core/services/rest/upload-rest.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { catchError, finalize } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { RestError } from '../../../../core/models/api.models';
import { EMPTY } from 'rxjs';

/**
 * The file drop component
 */
@Component({
  selector: 'app-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileDropComponent {

  /**
   * The form is loading flag
   */
  public formIsLoading = false;

  /**
   * Instantiates the component.
   *
   * @param uploadService the upload service
   * @param notificationService the notification service
   * @param decimalPipe the decimal pipe
   * @param ngZone the angular zone to manage the drop callback
   */
  constructor(
    private uploadService: UploadRestService,
    private notificationService: NotificationService,
    private decimalPipe: DecimalPipe,
    private ngZone: NgZone
  ) {}

  /**
   * Event triggered through a "drop".
   *
   * @param files
   */
  public dropped(files: NgxFileDropEntry[]) {
    if (!files || files.length !== 1 || !files[0].fileEntry.isFile) {
      return;
    }
    const fileEntry = files[0].fileEntry as FileSystemFileEntry;
    fileEntry.file((file: File) => {
      this.ngZone.run(() => {
        this.uploadFile(file);
      });
    });
  }

  /**
   * Event triggered through an input="file".
   *
   * @param event
   */
  public input(event: any) {
    if (!event.target || !event.target.files || event.target.files.length !== 1) {
      return;
    }
    const file = event.target.files[0];
    this.uploadFile(file);
  }

  /**
   * Uploads the file and triggers a 'SUCCESS' notification.
   *
   * @param file the file to upload
   */
  private uploadFile(file: File) {
    this.formIsLoading = true;
    this.uploadService.uploadFile(file, file.name).pipe(
      catchError((err: RestError) => {
        this.notificationService.notify({
          type: 'ERROR',
          ...err
        });
        return EMPTY;
      }),
      finalize(() => {
        this.formIsLoading = false;
      })
    ).subscribe((result) => {
      this.notificationService.notify({
        type: 'SUCCESS',
        code: 'B200',
        message: 'file_import_success',
        context: {
          imported: ''+result.imported,
          assigned: ''+result.assigned,
          total_amount: this.decimalPipe.transform(result.total_amount, '1.2-2') + ' €'
        }
      });
    });
  }

}
