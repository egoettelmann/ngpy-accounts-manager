import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Label } from '../../models/api.models';
import { LabelsRestService } from '../rest/labels-rest.service';

/**
 * The labels service
 */
@Injectable()
export class LabelsService {

  /**
   * Instantiates the service.
   *
   * @param labelsRestService the labels rest service
   */
  constructor(private labelsRestService: LabelsRestService) {
  }

  /**
   * Gets all labels.
   */
  getLabels(): Observable<Label[]> {
    return this.labelsRestService.getAll();
  }

  /**
   * Deletes a label.
   *
   * @param label the label to delete
   */
  deleteOne(label: Label): Observable<any> {
    return this.labelsRestService.deleteOne(label.id);
  }

  /**
   * Saves a label.
   *
   * @param label the label to save
   */
  saveOne(label: Label): Observable<Label> {
    return this.labelsRestService.saveOne(label);
  }

}
