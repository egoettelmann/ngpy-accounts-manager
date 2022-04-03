import { async, TestBed } from '@angular/core/testing';
import { StatisticsService } from './statistics.service';
import { StatisticsRestService } from '../rest/statistics-rest.service';
import { RqlService } from '../rql.service';
import { EMPTY } from 'rxjs';
import { format } from 'date-fns';
import { DateService } from '../date.service';

class MockStatisticsRestService {
  getSummary(): void {}
  getRepartition(): void {}
  getAggregation(): void {}
  getEvolution(): void {}
  getAnalyticsByCategory(): void {}
  getAnalyticsByLabel(): void {}
  getAnalyticsRepartition(): void {}
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
    let result: any[] = [];
    spyOn(restService, 'getSummary').and.callFake((...args) => {
      result = args;
      return EMPTY;
    });
    service.getSummary([], 2015, 4).subscribe();
    expect(restService.getSummary).toHaveBeenCalled();
    expect(result[0]).toEqual(new Date(2015, 3, 1), 'dateFrom is wrong');
    expect(result[1]).toEqual(new Date(2015, 4, 1), 'dateTo is wrong');
  }));

  it('getSummary should define correct date interval across years', async(() => {
    let result: any[] = [];
    spyOn(restService, 'getSummary').and.callFake((...args) => {
      result = args;
      return EMPTY;
    });
    service.getSummary([], 2018, 12).subscribe();
    expect(restService.getSummary).toHaveBeenCalled();
    expect(result[0]).toEqual(new Date(2018, 11, 1), 'dateFrom is wrong');
    expect(result[1]).toEqual(new Date(2019, 0, 1), 'dateTo is wrong');
  }));

  it('getSummary should define correct date interval without months', async(() => {
    let result: any[] = [];
    spyOn(restService, 'getSummary').and.callFake((...args) => {
      result = args;
      return EMPTY;
    });
    service.getSummary([], 2013).subscribe();
    expect(restService.getSummary).toHaveBeenCalled();
    expect(result[0]).toEqual(new Date(2013, 0, 1), 'dateFrom is wrong');
    expect(result[1]).toEqual(new Date(2014, 0, 1), 'dateTo is wrong');
  }));

  it('getAggregation should define correct date interval', async(() => {
    let result: any[] = [];
    spyOn(restService, 'getAggregation').and.callFake((...args) => {
      result = args;
      return EMPTY;
    });
    service.getAggregation(2013, [], [], true).subscribe();
    expect(restService.getAggregation).toHaveBeenCalled();
    const expectedDateFrom = format(new Date(2013, 0, 1), 'yyyy-MM-dd');
    const expectedDateTo = format(new Date(2014, 0, 1), 'yyyy-MM-dd');
    expect(result[1].collection[0].value).toEqual(expectedDateFrom, 'dateFrom is wrong');
    expect(result[1].collection[1].value).toEqual(expectedDateTo, 'dateTo is wrong');
  }));

  it('getEvolution should define correct date interval', async(() => {
    let result: any[] = [];
    spyOn(restService, 'getEvolution').and.callFake((...args) => {
      result = args;
      return EMPTY;
    });
    service.getEvolution(2013, []).subscribe();
    expect(restService.getEvolution).toHaveBeenCalled();
    expect(result[1]).toEqual(new Date(2013, 0, 1), 'dateFrom is wrong');
    expect(result[2]).toEqual(new Date(2014, 0, 1), 'dateTo is wrong');
  }));

  it('getRepartition should define correct date interval', async(() => {
    let result: any[] = [];
    spyOn(restService, 'getRepartition').and.callFake((...args) => {
      result = args;
      return EMPTY;
    });
    service.getRepartition(2015, 11, []).subscribe();
    expect(restService.getRepartition).toHaveBeenCalled();
    const expectedDateFrom = format(new Date(2015, 10, 1), 'yyyy-MM-dd');
    const expectedDateTo = format(new Date(2015, 11, 1), 'yyyy-MM-dd');
    expect(result[0].collection[0].value).toEqual(expectedDateFrom, 'dateFrom is wrong');
    expect(result[0].collection[1].value).toEqual(expectedDateTo, 'dateTo is wrong');
  }));

  it('getRepartition should define correct date interval across years', async(() => {
    let result: any[] = [];
    spyOn(restService, 'getRepartition').and.callFake((...args) => {
      result = args;
      return EMPTY;
    });
    service.getRepartition(2015, 12, []).subscribe();
    expect(restService.getRepartition).toHaveBeenCalled();
    const expectedDateFrom = format(new Date(2015, 11, 1), 'yyyy-MM-dd');
    const expectedDateTo = format(new Date(2016, 0, 1), 'yyyy-MM-dd');
    expect(result[0].collection[0].value).toEqual(expectedDateFrom, 'dateFrom is wrong');
    expect(result[0].collection[1].value).toEqual(expectedDateTo, 'dateTo is wrong');
  }));

  it('getAnalyticsByCategory should define correct date interval', async(() => {
    let result: any[] = [];
    spyOn(restService, 'getAnalyticsByCategory').and.callFake((...args) => {
      result = args;
      return EMPTY;
    });
    service.getAnalyticsByCategory(2016, '', '', []).subscribe();
    expect(restService.getAnalyticsByCategory).toHaveBeenCalled();
    const expectedDateFrom = format(new Date(2016, 0, 1), 'yyyy-MM-dd');
    const expectedDateTo = format(new Date(2017, 0, 1), 'yyyy-MM-dd');
    expect(result[1].collection[0].value).toEqual(expectedDateFrom, 'dateFrom is wrong');
    expect(result[1].collection[1].value).toEqual(expectedDateTo, 'dateTo is wrong');
  }));

  it('getAnalyticsByLabel should define correct date interval', async(() => {
    let result: any[] = [];
    spyOn(restService, 'getAnalyticsByLabel').and.callFake((...args) => {
      result = args;
      return EMPTY;
    });
    service.getAnalyticsByLabel(2016, '', 1, []).subscribe();
    expect(restService.getAnalyticsByLabel).toHaveBeenCalled();
    const expectedDateFrom = format(new Date(2016, 0, 1), 'yyyy-MM-dd');
    const expectedDateTo = format(new Date(2017, 0, 1), 'yyyy-MM-dd');
    expect(result[1].collection[0].value).toEqual(expectedDateFrom, 'dateFrom is wrong');
    expect(result[1].collection[1].value).toEqual(expectedDateTo, 'dateTo is wrong');
  }));

  it('getAnalyticsRepartition should define correct date interval', async(() => {
    let result: any[] = [];
    spyOn(restService, 'getAnalyticsRepartition').and.callFake((...args) => {
      result = args;
      return EMPTY;
    });
    service.getAnalyticsRepartition(2011, '', []).subscribe();
    expect(restService.getAnalyticsRepartition).toHaveBeenCalled();
    const expectedDateFrom = format(new Date(2011, 0, 1), 'yyyy-MM-dd');
    const expectedDateTo = format(new Date(2012, 0, 1), 'yyyy-MM-dd');
    expect(result[0].collection[0].value).toEqual(expectedDateFrom, 'dateFrom is wrong');
    expect(result[0].collection[1].value).toEqual(expectedDateTo, 'dateTo is wrong');
  }));

});
