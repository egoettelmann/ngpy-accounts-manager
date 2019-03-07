import { Component, Input, OnChanges, OnInit } from '@angular/core';

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
      this.groupedDetails = this.consolidateDetails(this.details);
    }
  }

  private consolidateDetails(details: any[]): any[] {
    const groupsByCategory = {};
    let total = 0;
    for (let i in details) {
      let detail = details[i];
      if (!groupsByCategory.hasOwnProperty(detail.category)) {
        groupsByCategory[detail.category] = [];
      }
      groupsByCategory[detail.category].push({
        label: detail.label,
        amount: detail.value,
        percentage: 0
      });
      total += detail.value;
    }
    const groupsWithDetails = [];
    for (let g in groupsByCategory) {
      const gd = {
        label: g,
        amount: groupsByCategory[g].reduce((t, a) => t + a.amount, 0),
        details: groupsByCategory[g].sort((g1, g2) => Math.abs(g2.amount) - Math.abs(g1.amount)),
        percentage: 0
      };
      groupsByCategory[g].map(g => g.percentage = g.amount / total * 100);
      gd.percentage = gd.amount / total * 100;
      groupsWithDetails.push(gd);
    }
    return groupsWithDetails.sort((g1, g2) => Math.abs(g2.amount) - Math.abs(g1.amount));
  }
}
