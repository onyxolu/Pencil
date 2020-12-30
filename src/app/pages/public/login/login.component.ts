import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public allowedAccess: boolean;
  private isLoading: boolean = false;

  constructor(router: Router, private authService: AuthService) {
    this.allowedAccess = this.authService.isRouteAuthenticated();
  }

  ngOnInit(): void {}

  tryGoogleLogin() {
    this.isLoading = true;
    this.authService.doGoogleLogin().then((res) => {
      this.isLoading = false;
    });
  }

  allowRouteAccess(): void {
    this.authService.setIsAuthenticated(true);
    this.allowedAccess = this.authService.isRouteAuthenticated();
  }
}
