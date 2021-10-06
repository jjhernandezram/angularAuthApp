import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
    `
      * {
        margin: 15px;
      }

      button {
        border: solid 1px;
        width: 100px;
        height: 30px;
        border-radius: 10px;
      }
    `,
  ],
})
export class DashboardComponent {
  get user() {
    return this.authService.getUser;
  }

  constructor(private router: Router, private authService: AuthService) {}

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
