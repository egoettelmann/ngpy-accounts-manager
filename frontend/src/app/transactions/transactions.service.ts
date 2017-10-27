import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TransactionsService {

  constructor(private http: HttpClient) {}

  getTransactions(year: string, month: string): Promise<any> {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('year', year);
    params = params.append('month', month);

    return this.http.get<any>('/rest/transactions', {params: params}).toPromise();
  }

}
