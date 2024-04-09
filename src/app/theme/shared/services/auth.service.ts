import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { Authuser } from '../modals/common.modal';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cryptoService: CryptoService, private _router: Router) { }

  setRememberData(data: Authuser) {
    this.setCookie("remember", data, 7);
  }

  getRememberData(): Authuser {
    return this.getCookie("remember");
  }

  setData(key: string, data: any) {
    localStorage.setItem(key, this.cryptoService.encryptData(data));
  }

  isAuthenticated(): boolean {
    const token = this.getData('access-token');
    if (token) {
      return true;
    }
    return false;
  }

  getData(key: string): any {
    const data = localStorage.getItem(key);
    if (data) {
      return this.cryptoService.decryptData(data);
    }
    return null;
  }

  setCookie(name: string, value: any, expiresDays: number): void {
    const date = new Date();
    date.setTime(date.getTime() + (expiresDays * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${this.cryptoService.encryptData(value)};${expires};path=/`;
  }

  getCookie(name: string): any {
    const cookieName = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (const cookie of cookieArray) {
      let trimmedCookie = cookie;
      while (trimmedCookie.charAt(0) === ' ') {
        trimmedCookie = trimmedCookie.substring(1);
      }
      if (trimmedCookie.indexOf(cookieName) === 0) {
        return this.cryptoService.decryptData(trimmedCookie.substring(cookieName.length, trimmedCookie.length));
      }
    }
    return null;
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this._router.navigateByUrl('/auth/login');
  }
}
