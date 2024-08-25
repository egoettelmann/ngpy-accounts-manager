import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  templateUrl: './transactions.view.html',
  styleUrls: ['./transactions.view.scss'],
  imports: [RouterOutlet]
})
export class TransactionsView {

  @HostBinding('class') hostClass = 'content-container';

}
