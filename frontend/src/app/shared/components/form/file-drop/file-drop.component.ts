import { Component, ViewEncapsulation } from '@angular/core';
import { UploadEvent, UploadFile } from 'ngx-file-drop';
import { UploadService } from '../../../../core/services/rest/upload.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Notification } from '../../../../core/models/notification';

@Component({
  selector: 'app-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileDropComponent {

  public files: UploadFile[] = [];

  constructor(
    private uploadService: UploadService,
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
    this.uploadService.uploadFile(file, file.name).subscribe(result => {
      this.notificationService.broadcast(new Notification('SUCCESS', 'B200', 'file_import_success'));
    });
  }

}
