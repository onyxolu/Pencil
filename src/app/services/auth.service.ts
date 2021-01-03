import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs';
import { User } from '../pages/model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthService {
  private isAuthenticated: boolean;
  private tokenExpirationTimer: any;
  user = new BehaviorSubject<User>(null);
  userdata: User = null;
  expiresIn = 360000;

  constructor(
    private http: HttpClient,
    public afAuth: AngularFireAuth,
    private router: Router
  ) {}

  public isRouteAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  public isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  public setIsAuthenticated(isAuth: boolean): void {
    this.isAuthenticated = isAuth;
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.signInWithPopup(provider).then(
        (res) => {
          const { user, additionalUserInfo } = res;
          this.handleAuthentication(user, additionalUserInfo, this.expiresIn);

          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  private handleAuthentication(
    userData: any,
    additionalUserInfo: any,
    expiresIn: number
  ) {
    const { uid, refreshToken } = userData;
    const { isNewUser, profile } = additionalUserInfo;
    const { email, name, picture, given_name, family_name } = profile;
    const userdata = {
      email: email,
      imgUrl: picture,
      name: name,
      firstName: given_name,
      lastName: family_name,
    };
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      userdata,
      uid,
      isNewUser,
      refreshToken,
      expirationDate
    );
    this.loginUser(user);
  }

  loginUser(user: User) {
    this.userdata = user;
    this.user.next(user);
    this.autoLogout(this.expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
    this.isAuthenticated = true;
    this.router.navigate(['/app']);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  logout() {
    return this.afAuth.signOut().then(() => {
      this.user.next(null);
      localStorage.removeItem('userData');
      if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
      }
      this.tokenExpirationTimer = null;
      this.isAuthenticated = false;
    });
  }

  logoutUser() {
    this.logout();
    this.router.navigate(['/login']);
  }
}
