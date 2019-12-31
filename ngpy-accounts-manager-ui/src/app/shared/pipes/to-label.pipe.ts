import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { LabelsService } from '../../core/services/domain/labels.service';
import { Label } from '../../core/models/api.models';
import { Subscription } from 'rxjs';

/**
 * The label name pipe.
 * Transforms a label id into its name.
 */
@Pipe({
  name: 'toLabel',
  pure: false
})
export class ToLabelPipe implements PipeTransform, OnDestroy {

  /**
   * The available labels
   */
  private labels: Label[];

  /**
   * The subscription
   */
  private subscription: Subscription;

  /**
   * Instantiates the pipe.
   *
   * @param labelsService the labels service
   */
  constructor(private labelsService: LabelsService) {
    this.subscription = this.labelsService.getLabels().subscribe(labels => {
      this.labels = labels;
    });
  }

  /**
   * Destroys the pipe
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Transforms a provided label id into a label name.
   *
   * @param labelId the label id
   * @param attribute the attribute to return
   */
  transform(labelId: number, attribute?: string): any {
    if (this.labels == null) {
      return this.getAttribute(
        this.defaultLabel(labelId),
        attribute
      );
    }

    const label = this.labels.find(l => l.id === labelId);
    if (label == null) {
      return this.getAttribute(
        this.defaultLabel(labelId),
        attribute
      );
    }

    return this.getAttribute(label, attribute);
  }

  /**
   * The default label.
   *
   * @param labelId the label id
   */
  private defaultLabel(labelId: number): Label {
    const defaultLabel = new Label();
    defaultLabel.id = labelId;
    defaultLabel.name = '';
    defaultLabel.color = '#cccccc';
    return defaultLabel;
  }

  /**
   * Extracts an attribute from the label.
   *
   * @param label the label
   * @param attribute the attribute to extract
   */
  private getAttribute(label: Label, attribute: string): any {
    if (attribute == null) {
      return label;
    }
    if (label.hasOwnProperty(attribute)) {
      return label[attribute];
    }
    return null;
  }

}
