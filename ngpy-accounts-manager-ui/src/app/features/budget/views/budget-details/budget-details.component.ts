import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../../../core/services/domain/budget.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Budget } from '../../../../core/models/api.models';

@Component({
  templateUrl: './budget-details.component.html',
  styleUrls: ['./budget-details.component.scss']
})
export class BudgetDetailsComponent implements OnInit {

  private budgetId: number;
  private budget: Budget;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private budgetService: BudgetService
  ) {}

  ngOnInit(): void {
    this.budgetId = +this.route.snapshot.paramMap.get('budgetId');
    this.budgetService.getDetails(this.budgetId).subscribe(details => {
      this.budget = details;
    });
  }

}
