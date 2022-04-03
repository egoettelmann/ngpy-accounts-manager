import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account, Label, Transaction } from '@core/models/api.models';
import { combineLatest, Subscription } from 'rxjs';
import { AccountsService } from '@core/services/domain/accounts.service';
import { ActivatedRoute } from '@angular/router';
import { TransactionsService } from '@core/services/domain/transactions.service';
import { RouterService } from '@core/services/router.service';
import { LabelsService } from '@core/services/domain/labels.service';

@Component({
  templateUrl: './forms-transaction.view.html',
  styleUrls: ['./forms-transaction.view.scss']
})
export class FormsTransactionView implements OnInit, OnDestroy {

  labels?: Label[];
  accounts?: Account[];
  selectedTransaction?: Transaction;

  showModal = false;

  private subscriptions = {
    static: new Subscription(),
    active: new Subscription()
  };

  constructor(
    private route: ActivatedRoute,
    private routerService: RouterService,
    private transactionsService: TransactionsService,
    private labelsService: LabelsService,
    private accountsService: AccountsService
  ) {
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('transactionId');
    let transactionId;
    if (param != null) {
      transactionId = +param;
    }
    const sub = combineLatest([
      this.transactionsService.getOne(transactionId),
      this.accountsService.getAccounts(),
      this.labelsService.getLabels()
    ]).subscribe(([transaction, accounts, labels]) => {
      this.selectedTransaction = transaction;
      if (this.selectedTransaction == null) {
        this.selectedTransaction = {};
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

  saveTransaction(transaction: Transaction): void {
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

  deleteTransaction(transaction: Transaction): void {
    this.transactionsService.deleteOne(transaction).subscribe(() => {
      this.closeModal();
    });
  }

  closeModal(): void {
    this.routerService.navigate('route.forms.close', undefined, {
      queryParamsHandling: 'preserve'
    });
    this.showModal = false;
  }

}
