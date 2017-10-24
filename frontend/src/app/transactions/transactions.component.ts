import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

@Component({
  templateUrl: './transactions.component.html'
})
export class TransactionsComponent implements OnInit {

  public monthList = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];
  public transactions: any[];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('year', '2017');
    params = params.append('month', '10');

    this.http.get<any>('/rest/transactions', {params: params}).subscribe(data => {
      this.transactions = data;
    });
  }

}
