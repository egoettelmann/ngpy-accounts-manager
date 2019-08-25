import { async, TestBed } from '@angular/core/testing';
import { StatisticsService } from './statistics.service';
import { StatisticsRestService } from '../rest/statistics-rest.service';
import { RqlService } from '../rql.service';
import { of } from 'rxjs';
import { format } from 'date-fns';
import { DateService } from '../date.service';

class MockStatisticsRestService {
  getSummary() {}
  getRepartition() {}
  getAggregation() {}
  getEvolution() {}
  getAnalytics() {}
  getAnalyticsDetails() {}
}

describe('StatisticsService', () => {

  let service: StatisticsService;
  let restService: StatisticsRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StatisticsService,
        RqlService,
        DateService,
        { provide: StatisticsRestService, useClass: MockStatisticsRestService }
      ]
    });

    service = TestBed.get(StatisticsService);
    restService = TestBed.get(StatisticsRestService);
  });

  it('should be instantiated', async(() => {
    expect(service).toBeDefined('Service is not defined');
  }));

  it('getSummary should define correct date interval', async(() => {
    let result = [];
    spyOn(restService, 'getSummary').and.callFake((...args) => {
      result = args;
      return of({});
    });
    service.getSummary([], 2015, 4).subscribe();
    expect(restService.getSummary).toHaveBeenCalled();
    expect(result[0]).toEqual(new Date(2015, 3, 1), 'dateFrom is wrong');
    expect(result[1]).toEqual(new Date(2015, 4, 1), 'dateTo is wrong');
  }));

  it('getSummary should define correct date interval across years', async(() => {
    let result = [];
    spyOn(restService, 'getSummary').and.callFake((...args) => {
      result = args;
      return of({});
    });
    service.getSummary([], 2018, 12).subscribe();
    expect(restService.getSummary).toHaveBeenCalled();
    expect(result[0]).toEqual(new Date(2018, 11, 1), 'dateFrom is wrong');
    expect(result[1]).toEqual(new Date(2019, 0, 1), 'dateTo is wrong');
  }));

  it('getSummary should define correct date interval without months', async(() => {
    let result = [];
    spyOn(restService, 'getSummary').and.callFake((...args) => {
      result = args;
      return of({});
    });
    service.getSummary([], 2013).subscribe();
    expect(restService.getSummary).toHaveBeenCalled();
    expect(result[0]).toEqual(new Date(2013, 0, 1), 'dateFrom is wrong');
    expect(result[1]).toEqual(new Date(2014, 0, 1), 'dateTo is wrong');
  }));

  it('getAggregation should define correct date interval', async(() => {
    let result = [];
    spyOn(restService, 'getAggregation').and.callFake((...args) => {
      result = args;
      return of({});
    });
    service.getAggregation(2013, [], [], undefined).subscribe();
    expect(restService.getAggregation).toHaveBeenCalled();
    const expectedDateFrom = format(new Date(2013, 0, 1), 'yyyy-MM-dd');
    const expectedDateTo = format(new Date(2014, 0, 1), 'yyyy-MM-dd');
    expect(result[1].collection[0].value).toEqual(expectedDateFrom, 'dateFrom is wrong');
    expect(result[1].collection[1].value).toEqual(expectedDateTo, 'dateTo is wrong');
  }));

  it('getEvolution should define correct date interval', async(() => {
    let result = [];
    spyOn(restService, 'getEvolution').and.callFake((...args) => {
      result = args;
      return of({});
    });
    service.getEvolution(2013, []).subscribe();
    expect(restService.getEvolution).toHaveBeenCalled();
    expect(result[1]).toEqual(new Date(2013, 0, 1), 'dateFrom is wrong');
    expect(result[2]).toEqual(new Date(2014, 0, 1), 'dateTo is wrong');
  }));

  it('getRepartition should define correct date interval', async(() => {
    let result = [];
    spyOn(restService, 'getRepartition').and.callFake((...args) => {
      result = args;
      return of({});
    });
    service.getRepartition(2015, 11, []).subscribe();
    expect(restService.getRepartition).toHaveBeenCalled();
    const expectedDateFrom = format(new Date(2015, 10, 1), 'yyyy-MM-dd');
    const expectedDateTo = format(new Date(2015, 11, 1), 'yyyy-MM-dd');
    expect(result[0].collection[0].value).toEqual(expectedDateFrom, 'dateFrom is wrong');
    expect(result[0].collection[1].value).toEqual(expectedDateTo, 'dateTo is wrong');
  }));

  it('getRepartition should define correct date interval across years', async(() => {
    let result = [];
    spyOn(restService, 'getRepartition').and.callFake((...args) => {
      result = args;
      return of({});
    });
    service.getRepartition(2015, 12, []).subscribe();
    expect(restService.getRepartition).toHaveBeenCalled();
    const expectedDateFrom = format(new Date(2015, 11, 1), 'yyyy-MM-dd');
    const expectedDateTo = format(new Date(2016, 0, 1), 'yyyy-MM-dd');
    expect(result[0].collection[0].value).toEqual(expectedDateFrom, 'dateFrom is wrong');
    expect(result[0].collection[1].value).toEqual(expectedDateTo, 'dateTo is wrong');
  }));

  it('getAnalytics should define correct date interval', async(() => {
    let result = [];
    spyOn(restService, 'getAnalytics').and.callFake((...args) => {
      result = args;
      return of({});
    });
    service.getAnalytics(2016, undefined, '', []).subscribe();
    expect(restService.getAnalytics).toHaveBeenCalled();
    const expectedDateFrom = format(new Date(2016, 0, 1), 'yyyy-MM-dd');
    const expectedDateTo = format(new Date(2017, 0, 1), 'yyyy-MM-dd');
    expect(result[1].collection[0].value).toEqual(expectedDateFrom, 'dateFrom is wrong');
    expect(result[1].collection[1].value).toEqual(expectedDateTo, 'dateTo is wrong');
  }));

  it('getAnalyticsDetails should define correct date interval', async(() => {
    let result = [];
    spyOn(restService, 'getAnalyticsDetails').and.callFake((...args) => {
      result = args;
      return of({});
    });
    service.getAnalyticsDetails(2011, undefined, []).subscribe();
    expect(restService.getAnalyticsDetails).toHaveBeenCalled();
    const expectedDateFrom = format(new Date(2011, 0, 1), 'yyyy-MM-dd');
    const expectedDateTo = format(new Date(2012, 0, 1), 'yyyy-MM-dd');
    expect(result[0].collection[0].value).toEqual(expectedDateFrom, 'dateFrom is wrong');
    expect(result[0].collection[1].value).toEqual(expectedDateTo, 'dateTo is wrong');
  }));

});
