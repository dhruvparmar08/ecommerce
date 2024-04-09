import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }

  encryptData(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), environment.secret_key).toString();
  }

  decryptData(encryptedData: string): string {
    return JSON.parse(CryptoJS.AES.decrypt(encryptedData, environment.secret_key).toString(CryptoJS.enc.Utf8));
  }
}
