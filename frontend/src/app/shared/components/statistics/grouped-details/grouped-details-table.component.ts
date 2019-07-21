import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonFunctions } from '../../../utils/common-functions';

@Component({
  selector: 'app-grouped-details-table',
  templateUrl: './grouped-details-table.component.html',
  styleUrls: ['./grouped-details-table.component.scss']
})
export class GroupedDetailsTableComponent implements OnChanges, OnInit {

  @Input() details: any[];
  @Input() expanded = true;

  groupedDetails : any[];

  ngOnInit(): void {}

  ngOnChanges(changes) {
    if (changes.details) {
      this.groupedDetails = CommonFunctions.consolidateDetails(this.details);
    }
  }

}
