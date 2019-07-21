import { Component, NgZone, ViewEncapsulation } from '@angular/core';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { UploadRestService } from '../../../../core/services/rest/upload-rest.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileDropComponent {

  constructor(
    private uploadService: UploadRestService,
    private notificationService: NotificationService,
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
    this.uploadService.uploadFile(file, file.name).subscribe(() => {
      this.notificationService.broadcast({
        type: 'SUCCESS',
        code: 'B200',
        content: 'file_import_success'
      });
    });
  }

}
