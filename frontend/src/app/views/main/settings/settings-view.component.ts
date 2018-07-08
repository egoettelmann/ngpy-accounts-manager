import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './settings-view.component.html'
})
export class SettingsViewComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-container';

  constructor(private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
  }

}
