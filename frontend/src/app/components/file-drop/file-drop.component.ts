import { Component, ViewEncapsulation } from '@angular/core';
import { UploadFile, UploadEvent } from 'ngx-file-drop';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileDropComponent {

  public files: UploadFile[] = [];

  constructor(private uploadService: UploadService) {}

  public dropped(event: UploadEvent) {
    this.files = event.files;
    for (const file of event.files) {
      file.fileEntry.file(f => {
        this.uploadService.uploadFile(f, f.name).subscribe(() => {
          console.log('uploaded', f.name);
        });
      });
    }
  }
}
