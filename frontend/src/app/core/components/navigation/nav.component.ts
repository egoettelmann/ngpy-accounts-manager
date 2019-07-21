import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SessionRestService } from '../../services/rest/session-rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  @ViewChild('searchInput', { static: false }) searchInput: ElementRef;

  constructor(
    private router: Router,
    private sessionService: SessionRestService
  ) {
  }

  ngOnInit(): void {
  }

  clickLogout(): void {
    this.sessionService.logout().subscribe(() => {
      this.router.navigate(['login']);
    });
  }

  search(value: string) {
    this.router.navigate(['search'], {
      queryParams: {
        desc: value
      }
    });
    this.searchInput.nativeElement.value = '';
  }

}
