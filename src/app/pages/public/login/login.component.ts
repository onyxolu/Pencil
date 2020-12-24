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

  constructor(router: Router, private authService: AuthService) {
    this.allowedAccess = this.authService.isRouteAuthenticated();
  }

  ngOnInit(): void {}

  allowRouteAccess(): void {
    this.authService.setIsAuthenticated(true);
    this.allowedAccess = this.authService.isRouteAuthenticated();
  }
}
