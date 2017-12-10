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
}
