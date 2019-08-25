import { async, TestBed } from '@angular/core/testing';
import { RqlService } from './rql.service';
import { FilterOperator, FilterRequest } from '../models/rql.models';

describe('RqlService', () => {

  let service: RqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RqlService
      ]
    });

    service = TestBed.get(RqlService);
  });

  it('FilterRequest should be serialized as expected', async(() => {
    const filterRequest = FilterRequest.of('field', 'value', FilterOperator.EQ);
    expect(filterRequest.toString()).toEqual('eq(field,value)');
  }));

  it('FilterRequest should be serialized with URI encoded values', async(() => {
    const filterRequest = FilterRequest.of('field', 'v;a7u%e?', FilterOperator.EQ);
    expect(filterRequest.toString()).toEqual('eq(field,v%3Ba7u%25e%3F)');
  }));

  it('FilterRequest with "and" collection should be serialized as expected', async(() => {
    const filterRequest = FilterRequest.all(
      FilterRequest.of('field1', 'value1', FilterOperator.EQ),
      FilterRequest.of('field2', 'value2', FilterOperator.CT)
    );
    expect(filterRequest.toString()).toEqual('and(eq(field1,value1);ct(field2,value2))');
  }));

  it('FilterRequest with "or" collection should be serialized as expected', async(() => {
    const filterRequest = FilterRequest.either(
      FilterRequest.of('field1', 'value1', FilterOperator.EQ),
      FilterRequest.of('field2', 'value2', FilterOperator.CT)
    );
    expect(filterRequest.toString()).toEqual('or(eq(field1,value1);ct(field2,value2))');
  }));

  it('FilterRequest with nested collection should be serialized as expected', async(() => {
    const filterRequest = FilterRequest.either(
      FilterRequest.of('field1', 'value1', FilterOperator.EQ),
      FilterRequest.all(
        FilterRequest.of('field2', 'value2', FilterOperator.CT),
        FilterRequest.of('field3', 'value3', FilterOperator.LT)
      )
    );
    expect(filterRequest.toString()).toEqual('or(eq(field1,value1);and(ct(field2,value2);lt(field3,value3)))');
  }));

  it('FilterRequest with nested "and" collection should be serialized flattened', async(() => {
    const filterRequest = FilterRequest.all(
      FilterRequest.of('field1', 'value1', FilterOperator.NE),
      FilterRequest.all(
        FilterRequest.of('field2', 'value2', FilterOperator.CT),
        FilterRequest.of('field3', 'value3', FilterOperator.LE)
      )
    );
    expect(filterRequest.toString()).toEqual('and(ne(field1,value1);ct(field2,value2);le(field3,value3))');
  }));

  it('FilterRequest with nested "or" collection should be serialized flattened', async(() => {
    const filterRequest = FilterRequest.either(
      FilterRequest.of('field1', 'value1', FilterOperator.NE),
      FilterRequest.either(
        FilterRequest.of('field2', 'value2', FilterOperator.CT),
        FilterRequest.of('field3', 'value3', FilterOperator.LE)
      )
    );
    expect(filterRequest.toString()).toEqual('or(ne(field1,value1);ct(field2,value2);le(field3,value3))');
  }));

});
