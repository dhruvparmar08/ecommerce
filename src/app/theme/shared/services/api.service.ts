import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CryptoService } from './crypto.service';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { Response } from '../modals/common.modal';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private cryptoservice: CryptoService, private _auth: AuthService, private _toastr: ToastrService) { }

  // Common method to make HTTP requests
  request<T>(
    method: string,
    url: string,
    options: {
      body?: any,
      params?: any,
      headers?: HttpHeaders,
      formData?: any
    } = {}
  ): Observable<T> {
    let httpOptions = {
      headers: options.headers || new HttpHeaders(),
      body: options.body ? { info: this.cryptoservice.encryptData(options.body) } : options.formData,
      params: new HttpParams()
    };

    const URL = environment.api_url + url;
    const timeoutDuration = environment.timeoutDuration;

    if (options.params) {
      for (const key in options.params) {
        if (options.params.hasOwnProperty(key)) {
          httpOptions.params = httpOptions.params.set(key, options.params[key]);
        }
      }
    }

    switch (method.toLowerCase()) {
      case 'get':
        return this.http.get<T>(URL, { headers: httpOptions.headers, params: httpOptions.params }).
          pipe(
            timeout(timeoutDuration),
            catchError(error => {
              if (error.status == 401) {
                this._toastr.error(error.error.message);
                this._auth.logout();
                return throwError({});
              }

              if (error.name === "HttpErrorResponse" || error.name === "TimeoutError") {
                this._toastr.error("Your browser could not establish a connection to the website's server in time.", "");
                return throwError({});
              }

              return throwError(error);
            }),
            tap((response: any) => {
              if (response.data) {
                response.data = this.cryptoservice.decryptData(response.data);
              }

              return response;
            })
          );
      case 'post':
        return this.http.post<T>(URL, httpOptions.body, { headers: httpOptions.headers }).
          pipe(
            timeout(timeoutDuration),
            catchError(error => {
              if (error.status == 401) {
                this._toastr.error(error.error.message);
                this._auth.logout();
              }

              if (error.name === "TimeoutError") {
                this._toastr.error("Your browser could not establish a connection to the website's server in time.", "");
              }

              return throwError(error);
            }),
            tap((response: any) => {
              if (response.data) {
                response.data = this.cryptoservice.decryptData(response.data);
              }

              return response;
            })
          );
      case 'put':
        return this.http.put<T>(URL, httpOptions.body, { headers: httpOptions.headers }).
          pipe(
            timeout(timeoutDuration),
            catchError(error => {
              if (error.status == 401) {
                this._toastr.error(error.error.message);
                this._auth.logout();
              }

              if (error.name === "TimeoutError") {
                this._toastr.error("Your browser could not establish a connection to the website's server in time.", "");
              }

              return throwError(error);
            }),
            tap((response: any) => {
              if (response.data) {
                response.data = this.cryptoservice.decryptData(response.data);
              }

              return response;
            })
          );
      case 'delete':
        return this.http.delete<T>(URL, { headers: httpOptions.headers, params: httpOptions.params }).
          pipe(
            timeout(timeoutDuration),
            catchError(error => {
              if (error.status == 401) {
                this._toastr.error(error.error.message);
                this._auth.logout();
              }

              if (error.name === "TimeoutError") {
                this._toastr.error("Your browser could not establish a connection to the website's server in time.", "");
              }

              return throwError(error);
            }),
            tap((response: any) => {
              if (response.data) {
                response.data = this.cryptoservice.decryptData(response.data);
              }

              return response;
            })
          );
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

}
