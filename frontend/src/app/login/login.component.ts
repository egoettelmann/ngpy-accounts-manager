import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StateService} from '@uirouter/angular';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public loginForm: {username?: String, password?: String} = {};

  constructor(private http: HttpClient, private $state: StateService) {}

  ngOnInit(): void {}

  tryLogin(): void {
    this.http.post<any>('/rest/login', this.loginForm).subscribe(data => {
      console.log('LOGIN', data);
      this.$state.go('root.dashboard');
    });
  }

}
