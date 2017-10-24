import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  public accounts: any[];
  public total: number;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('/rest/accounts').subscribe(data => {
      this.accounts = data;
      this.total = 0;
      for (const a of this.accounts) {
        this.total += a.total;
      }
    });
  }

}
