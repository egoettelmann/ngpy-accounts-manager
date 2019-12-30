import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account, Label, Transaction } from '../../../../models/api.models';
import { combineLatest, Subscription } from 'rxjs';
import { LabelsRestService } from '../../../../services/rest/labels-rest.service';
import { AccountsService } from '../../../../services/domain/accounts.service';
import { ActivatedRoute } from '@angular/router';
import { TransactionsService } from '../../../../services/domain/transactions.service';
import { RouterService } from '../../../../services/router.service';

@Component({
  templateUrl: './forms-transaction.view.html',
  styleUrls: ['./forms-transaction.view.scss']
})
export class FormsTransactionView implements OnInit, OnDestroy {

  labels: Label[];
  accounts: Account[];
  selectedTransaction: Transaction;

  showModal = false;

  private subscriptions = {
    static: new Subscription(),
    active: new Subscription()
  };

  constructor(
    private route: ActivatedRoute,
    private routerService: RouterService,
    private transactionsService: TransactionsService,
    private labelsService: LabelsRestService,
    private accountsService: AccountsService
  ) {
  }

  ngOnInit(): void {
    const transactionId = +this.route.snapshot.paramMap.get('transactionId');
    const sub = combineLatest([
      this.transactionsService.getOne(transactionId),
      this.accountsService.getAccounts(),
      this.labelsService.getAll()
    ]).subscribe(([transaction, accounts, labels]) => {
      this.selectedTransaction = transaction;
      if (this.selectedTransaction == null) {
        this.selectedTransaction = new Transaction();
      }
      this.accounts = accounts.slice(0);
      this.labels = labels.slice(0);
      this.showModal = true;
    });
    this.subscriptions.static.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.static.unsubscribe();
    this.subscriptions.active.unsubscribe();
  }

  saveTransaction(transaction: Transaction) {
    if (transaction.id != null) {
      this.transactionsService.updateOne(transaction.id, transaction).subscribe(() => {
        this.closeModal();
      });
    } else {
      this.transactionsService.createOne(transaction).subscribe(() => {
        this.closeModal();
      });
    }
  }

  deleteTransaction(transaction: Transaction) {
    this.transactionsService.deleteOne(transaction).subscribe(() => {
      this.closeModal();
    });
  }

  closeModal() {
    this.routerService.navigate('route.forms.close', undefined, {
      queryParamsHandling: 'merge'
    });
    this.showModal = false;
  }

}
