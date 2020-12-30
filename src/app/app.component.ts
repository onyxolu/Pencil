import { Component, OnInit } from '@angular/core';
import { User } from './pages/model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'pencil-FE';

  constructor(public authService: AuthService) {}

  ngOnInit() {
    const user = localStorage.getItem('userData');
    if (user) {
      const userData: User = JSON.parse(user);
      this.authService.loginUser(userData);
    }
  }

  logOut() {
    this.authService.logoutUser();
  }
}
