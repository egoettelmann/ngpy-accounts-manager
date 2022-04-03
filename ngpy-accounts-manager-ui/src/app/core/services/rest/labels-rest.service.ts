import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Label } from '../../models/api.models';
import { CommonFunctions } from '@shared/utils/common-functions';
import { EventBusService } from '../event-bus.service';
import { flatMap, startWith, tap } from 'rxjs/operators';
import { CacheService } from '../cache.service';

/**
 * The labels rest service.
 */
@Injectable()
export class LabelsRestService {

  /**
   * Instantiates the service.
   *
   * @param http the HTTP client
   * @param eventBusService the event bus service
   * @param cacheService the cache service
   */
  constructor(private http: HttpClient,
              private eventBusService: EventBusService,
              private cacheService: CacheService
  ) {
  }

  /**
   * Gets all labels
   */
  getAll(): Observable<Label[]> {
    return this.eventBusService.accept(['labels.*']).pipe(
      startWith(0),
      flatMap(() => this.loadLabels())
    );
  }

  /**
   * Deletes a label.
   *
   * @param labelId the label id to delete
   */
  deleteOne(labelId: number): Observable<any> {
    return this.http.delete('/rest/labels/' + labelId).pipe(
      tap(() => this.cacheService.evict('labels.*')),
      tap(() => this.eventBusService.publish('labels.delete', labelId))
    );
  }

  /**
   * Saves a label.
   *
   * @param label the label to save
   */
  saveOne(label: Label): Observable<Label> {
    return this.http.post<Label>('/rest/labels', CommonFunctions.removeEmpty(label)).pipe(
      tap(() => this.cacheService.evict('labels.*')),
      tap(() => this.eventBusService.publish('labels.update', label))
    );
  }

  /**
   * Load the labels (from the cache if available)
   */
  private loadLabels(): Observable<Label[]> {
    return this.cacheService.retrieve<Label[]>(
      'labels.all',
      this.http.get<Label[]>('/rest/labels')
    );
  }

}
