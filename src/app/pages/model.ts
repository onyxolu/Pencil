export class User {
  uid: string;
  constructor(
    public userData: Profile,
    public id: string,
    public isNewUser: boolean,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}

export class Profile {
  email: string;
  imgUrl: string;
  name: string;
  firstName: string;
  lastName: boolean;
}
