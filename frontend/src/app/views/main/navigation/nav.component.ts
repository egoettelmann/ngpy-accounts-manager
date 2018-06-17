import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  currentYear: string;
  currentMonth: string;

  constructor(
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    const d = new Date();
    this.currentYear = String(d.getFullYear());
    this.currentMonth = String(d.getMonth() + 1);
  }

  clickLogout(): void {
    this.sessionService.logout().subscribe(() => {
      this.router.navigate(['login']);
    });
  }

}
