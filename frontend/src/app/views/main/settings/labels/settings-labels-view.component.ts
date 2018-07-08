import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelsService } from '../../../../services/labels.service';
import { Label } from '../../../../components/transactions/label';

@Component({
  templateUrl: './settings-labels-view.component.html',
  styleUrls: ['./settings-labels-view.component.scss']
})
export class SettingsLabelsViewComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  labels: Label[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private labelsService: LabelsService) {
  }

  ngOnInit(): void {
    this.labelsService.getAll().subscribe(labels => {
      this.labels = labels.slice(0);
    });
  }

}
