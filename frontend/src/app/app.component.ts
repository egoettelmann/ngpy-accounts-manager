import {Component, Input, OnInit} from '@angular/core';

@Component({
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @Input() connectedUser;

  ngOnInit(): void {
    console.log('connectedUser', this.connectedUser);
  }
}
