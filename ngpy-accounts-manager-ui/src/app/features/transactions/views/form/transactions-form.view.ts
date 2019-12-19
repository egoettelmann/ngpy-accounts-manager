import { Component, OnInit } from '@angular/core';
import { Account, Label, Transaction } from '../../../../core/models/api.models';

@Component({
  templateUrl: './transactions-form.view.html',
  styleUrls: ['./transactions-form.view.scss']
})
export class TransactionsFormView implements OnInit {

  labels: Label[];
  accounts: Account[];
  selectedTransaction: Transaction;

  showModal = false;

  ngOnInit(): void {
  }

  saveTransaction(transaction: Transaction) {}

  closeModal() {}

  deleteTransaction(transaction: Transaction) {}

}
