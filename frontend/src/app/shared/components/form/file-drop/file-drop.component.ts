import { Component, ViewEncapsulation } from '@angular/core';
import { UploadEvent, UploadFile } from 'ngx-file-drop';
import { UploadRestService } from '../../../../core/services/rest/upload-rest.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileDropComponent {

  public files: UploadFile[] = [];

  constructor(
    private uploadService: UploadRestService,
    private notificationService: NotificationService
  ) {}

  public dropped(event: any) {
    if (event instanceof UploadEvent) {
      // This is a drop event
      this.files = event.files;
      for (const file of event.files) {
        file.fileEntry.file(f => {
          this.uploadFile(f);
        });
      }
    } else {
      // This is an event triggered through input="file"
      this.files = [];
      for (const file of event.target.files) {
        file.relativePath = file.name;
        this.uploadFile(file);
      }
    }
  }

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
