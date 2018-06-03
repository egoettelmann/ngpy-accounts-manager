import { NgModule } from '@angular/core';
import { TransactionsTableComponent } from './transactions-table.component';
import { TransactionsService } from './transactions.service';
import { SharedModule } from '../shared/shared.module';
import { StatisticsModule } from '../statistics/statistics.module';
import { TransactionsFormComponent } from './transactions-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LabelsService } from './labels.service';
import { ClarityModule } from 'clarity-angular';
import { CategoriesService } from './categories.service';
import { AutocompleteComponent } from '../../components/autocomplete/autocomplete.component';

@NgModule({
  declarations: [
    TransactionsTableComponent,
    TransactionsFormComponent,
    AutocompleteComponent,
  ],
  exports: [
    TransactionsTableComponent,
    TransactionsFormComponent
  ],
  providers: [
    TransactionsService,
    LabelsService,
    CategoriesService
  ],
  imports: [
    StatisticsModule,
    ClarityModule.forChild(),
    ReactiveFormsModule,
    SharedModule
  ]
})
export class TransactionsModule {
}
