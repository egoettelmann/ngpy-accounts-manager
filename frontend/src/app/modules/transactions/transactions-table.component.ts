import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import {Transaction} from './transaction';
import { Label } from './label';
import { LabelsService } from './labels.service';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html'
})
export class TransactionsTableComponent implements OnChanges, OnInit {

  @Input() transactions: Transaction[];

  @Output() onSelect = new EventEmitter<Transaction>();
  @Output() onChangeLabel = new EventEmitter<Transaction>();

  labels: Label[];

  constructor(private labelService: LabelsService) {}

  ngOnInit(): void {
    this.labelService.getAll().subscribe(labels => {
      this.labels = labels;
    });
  }

  ngOnChanges(changes) {
    if (changes.transactions != null) {
      console.log('TransactionsTableComponent.ngOnChanges');
    }
  }

  select(transaction: Transaction) {
    this.onSelect.emit(transaction);
  }

  changeLabel(label: Label, transaction: Transaction) {
    if (label
      && transaction
      && transaction.label
      && label.id !== transaction.label.id) {
      const t = Object.assign({}, transaction);
      t.label = label;
      delete t.label['toString'];
      this.onChangeLabel.emit(t);
    }
  }

  labelDropdownFormatter(data: any): string {
    if (data && data.id) {
      return data.name;
    }
    return '';
  }

}
