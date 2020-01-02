import { async, TestBed } from '@angular/core/testing';
import { RqlService } from './rql.service';
import { FilterOperator, FilterRequest } from '../models/rql.models';
import { CacheService } from './cache.service';
import { of, Subject } from 'rxjs';

describe('CacheService', () => {

  let service: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CacheService
      ]
    });

    service = TestBed.get(CacheService);
  });

  it('retrieve should return correct value', async(() => {
    const results = [];
    const subject = new Subject();
    const sub = service.retrieve('key.test', subject.asObservable()).subscribe(val => {
      results.push(val);
    });
    subject.next(13);

    expect(results.length).toEqual(1, 'Wrong results length');
    expect(results[0]).toEqual(13, 'Wrong result');

    sub.unsubscribe();
  }));

  it('retrieve should return latest value to new subscriptions', async(() => {
    const results1 = [];
    const subject = new Subject();
    const sub1 = service.retrieve('key.test', subject.asObservable()).subscribe(val => {
      results1.push(val);
    });
    subject.next(13);
    subject.next(42);
    const results2 = [];
    const sub2 = service.retrieve('key.test', subject.asObservable()).subscribe(val => {
      results2.push(val);
    });

    expect(results1.length).toEqual(2, 'Wrong results 1 length');
    expect(results1[0]).toEqual(13, 'Wrong result 1.0');
    expect(results1[1]).toEqual(42, 'Wrong result 1.1');
    expect(results2.length).toEqual(1, 'Wrong results 2 length');
    expect(results2[0]).toEqual(42, 'Wrong result 2.1');

    sub1.unsubscribe();
    sub2.unsubscribe();
  }));

  it('evict should correctly empty cache', async(() => {
    const results1 = [];
    const subject1 = new Subject();
    const sub1 = service.retrieve('key.test1', subject1.asObservable()).subscribe(val => {
      results1.push(val);
    });
    subject1.next(11);
    subject1.next(12);

    const results2 = [];
    const subject2 = new Subject();
    const sub2 = service.retrieve('key.test2', subject2.asObservable()).subscribe(val => {
      results2.push(val);
    });
    subject2.next(21);
    subject2.next(22);

    service.evict('key.*');

    const results3 = [];
    const sub3 = service.retrieve('key.test1', subject1.asObservable()).subscribe(val => {
      results3.push(val);
    });

    const results4 = [];
    const sub4 = service.retrieve('key.test2', subject2.asObservable()).subscribe(val => {
      results4.push(val);
    });

    subject1.next(13);
    subject2.next(23);

    expect(results1.length).toEqual(3, 'Wrong results length');
    expect(results1[0]).toEqual(11, 'Wrong result 0');
    expect(results1[1]).toEqual(12, 'Wrong result 1');
    expect(results1[2]).toEqual(13, 'Wrong result 2');

    expect(results2.length).toEqual(3, 'Wrong results length');
    expect(results2[0]).toEqual(21, 'Wrong result 0');
    expect(results2[1]).toEqual(22, 'Wrong result 1');
    expect(results2[2]).toEqual(23, 'Wrong result 2');

    expect(results3.length).toEqual(1, 'Wrong results length');
    expect(results3[0]).toEqual(13, 'Wrong result 0');

    expect(results4.length).toEqual(1, 'Wrong results length');
    expect(results4[0]).toEqual(23, 'Wrong result 0');

    sub1.unsubscribe();
    sub2.unsubscribe();
    sub3.unsubscribe();
    sub4.unsubscribe();
  }));

});
