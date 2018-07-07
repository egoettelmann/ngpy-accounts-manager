import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(
    private router: Router,
    private sessionService: SessionService
  ) {
  }

  ngOnInit(): void {
  }

  clickLogout(): void {
    this.sessionService.logout().subscribe(() => {
      this.router.navigate(['login']);
    });
  }

}
