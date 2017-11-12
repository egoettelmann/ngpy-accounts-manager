import {Component, OnInit} from '@angular/core';
import {StateService} from '@uirouter/angular';
import {SessionService} from '../../session.service';
import {NotificationService} from '../../modules/notification/notification.service';
import {Notification} from '../../modules/notification/notification';

@Component({
  templateUrl: './login-view.component.html'
})
export class LoginViewComponent implements OnInit {

  public errorNotification: Notification;
  public showErrorModal = false;
  public formInError = false;
  public formIsLoading = false;
  public loginForm: {username?: String, password?: String} = {};

  constructor(private $state: StateService, private sessionService: SessionService, private notificationService: NotificationService) {
    notificationService.getEventEmitter().subscribe((n) => {
      console.log('event', n);
      this.errorNotification = n;
      this.showErrorModal = true;
    });
  }

  ngOnInit(): void {}

  tryLogin(): void {
    this.formInError = false;
    this.formIsLoading = true;
    this.sessionService.login(this.loginForm).then(data => {
      this.$state.go('root.dashboard');
    }, err => {
      this.formInError = true;
      this.formIsLoading = false;
    });
  }

}
