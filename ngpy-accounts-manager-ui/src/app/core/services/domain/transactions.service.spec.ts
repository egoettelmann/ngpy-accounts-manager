import { async, TestBed } from '@angular/core/testing';
import { RqlService } from '../rql.service';
import { EMPTY, of } from 'rxjs';
import { format } from 'date-fns';
import { DateService } from '../date.service';
import { TransactionsRestService } from '../rest/transactions-rest.service';
import { TransactionsService } from './transactions.service';

class MockTransactionsRestService {
  getAll(): void {}
  getTopCredits(): void {}
  getTopDebits(): void {}
}

describe('TransactionsService', () => {

  let service: TransactionsService;
  let restService: TransactionsRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionsService,
        RqlService,
        DateService,
        { provide: TransactionsRestService, useClass: MockTransactionsRestService }
      ]
    });

    service = TestBed.get(TransactionsService);
    restService = TestBed.get(TransactionsRestService);
  });

  it('should be instantiated', async(() => {
    expect(service).toBeDefined('Service is not defined');
  }));

  it('getAll should define correct date interval', async(() => {
    let result: any = {};
    spyOn(restService, 'getAll').and.callFake((args) => {
      result = args;
      return EMPTY;
    });
    const sub = service.getAll(2015, 4, []).subscribe();
    expect(restService.getAll).toHaveBeenCalled();
    const expectedDateFrom = format(new Date(2015, 3, 1), 'yyyy-MM-dd');
    const expectedDateTo = format(new Date(2015, 4, 1), 'yyyy-MM-dd');
    expect(result.filter.collection[0].value).toEqual(expectedDateFrom, 'dateFrom is wrong');
    expect(result.filter.collection[1].value).toEqual(expectedDateTo, 'dateTo is wrong');
    sub.unsubscribe();
  }));

  it('getAll should define correct date interval across years', async(() => {
    let result: any = {};
    spyOn(restService, 'getAll').and.callFake((args) => {
      result = args;
      return EMPTY;
    });
    const sub = service.getAll(2016, 12, []).subscribe();
    expect(restService.getAll).toHaveBeenCalled();
    const expectedDateFrom = format(new Date(2016, 11, 1), 'yyyy-MM-dd');
    const expectedDateTo = format(new Date(2017, 0, 1), 'yyyy-MM-dd');
    expect(result.filter.collection[0].value).toEqual(expectedDateFrom, 'dateFrom is wrong');
    expect(result.filter.collection[1].value).toEqual(expectedDateTo, 'dateTo is wrong');
    sub.unsubscribe();
  }));

  it('getTopCredits should define correct date interval', async(() => {
    let result: any = {};
    spyOn(restService, 'getAll').and.callFake((args) => {
      result = args;
      return EMPTY;
    });
    const sub = service.getTopCredits(2011, [], []).subscribe();
    expect(restService.getAll).toHaveBeenCalled();
    const expectedDateFrom = format(new Date(2011, 0, 1), 'yyyy-MM-dd');
    const expectedDateTo = format(new Date(2012, 0, 1), 'yyyy-MM-dd');
    expect(result.filter.collection[0].value).toEqual(expectedDateFrom, 'dateFrom is wrong');
    expect(result.filter.collection[1].value).toEqual(expectedDateTo, 'dateTo is wrong');
    sub.unsubscribe();
  }));

  it('getTopDebits should define correct date interval', async(() => {
    let result: any = {};
    spyOn(restService, 'getAll').and.callFake((args) => {
      result = args;
      return EMPTY;
    });
    const sub = service.getTopDebits(2013, [], []).subscribe();
    expect(restService.getAll).toHaveBeenCalled();
    const expectedDateFrom = format(new Date(2013, 0, 1), 'yyyy-MM-dd');
    const expectedDateTo = format(new Date(2014, 0, 1), 'yyyy-MM-dd');
    expect(result.filter.collection[0].value).toEqual(expectedDateFrom, 'dateFrom is wrong');
    expect(result.filter.collection[1].value).toEqual(expectedDateTo, 'dateTo is wrong');
    sub.unsubscribe();
  }));

});
