import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Label } from '../../models/api.models';
import { CommonFunctions } from '../../../shared/utils/common-functions';
import { EventBusService } from '../event-bus.service';
import { flatMap, startWith, tap } from 'rxjs/operators';

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
   */
  constructor(private http: HttpClient,
              private eventBusService: EventBusService
  ) {
  }

  /**
   * Gets all labels
   */
  getAll(): Observable<Label[]> {
    return this.eventBusService.accept(['labels.*']).pipe(
      startWith(0),
      flatMap(() => this.http.get<Label[]>('/rest/labels'))
    );
  }

  /**
   * Deletes a label.
   *
   * @param label the label to delete
   */
  deleteOne(label: Label) {
    return this.http.delete('/rest/labels/' + label.id).pipe(
      tap(() => this.eventBusService.publish('labels.delete', label.id))
    );
  }

  /**
   * Saves a label.
   *
   * @param label the label to save
   */
  saveOne(label: Label): Observable<Label> {
    return this.http.post<Label>('/rest/labels', CommonFunctions.removeEmpty(label)).pipe(
      tap(() => this.eventBusService.publish('labels.update', label))
    );
  }

}
