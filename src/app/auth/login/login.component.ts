import { Component, OnInit, OnDestroy } from '@angular/core';

// Modules
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/theme/shared/services/auth.service';
import { LoadingService } from 'src/app/theme/shared/services/loading.service';
import { ApiService } from 'src/app/theme/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { CryptoService } from 'src/app/theme/shared/services/crypto.service';
import { DeviceDetectorService } from 'ngx-device-detector';

import { Response } from 'src/app/theme/shared/modals/common.modal';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxTrimDirectiveModule
  ],
  providers: [
    ApiService
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  isSubmit: boolean = false;
  isValidSubmit: boolean = false;

  showpwd: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private loadingService: LoadingService,
    private _toaster: ToastrService,
    private _api: ApiService,
    private _router: Router,
    private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
    // this.createLogin();
    const AuthData = this._auth.getRememberData();
    if (AuthData && Object.entries(AuthData).length > 0) {
      this.createLogin(AuthData);
    } else {
      this.createLogin({});
    }
  }

  createLogin(data: any) {
    this.loginForm = this._fb.group({
      email: [data.email, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      isremember: [false]
    })
  }

  get f() {
    return this.loginForm;
  }

  submit() {
    this.isSubmit = true;

    if (this.f.valid) {
      this.loadingService.setLoadingState(true);
      this.isValidSubmit = true;
      const authData = this.f.getRawValue();
      authData['user_device'] = this.deviceService.userAgent;
      authData['user_device_type'] = this.deviceService.isMobile() ? 'Mobile' : this.deviceService.isTablet() ? 'Tablet' : 'Desktop';
      
      this._api.request('post', '/login', { body: authData })
      .subscribe(
        (res: Response) => {
          this.loadingService.setLoadingState(false);
          this.isValidSubmit = false;

          if (res.success) {
            if (this.f.get('isremember').value) {
              this._auth.setRememberData(authData);
            }

            this._auth.setData('access-token', res.data.token);
            this._toaster.success(res.message, "");

            this._router.navigateByUrl('/main');
          } else {
            this._toaster.error(res.message, "");
          }
        }, (err) => {
          console.log("err ::", err);
          this.loadingService.setLoadingState(false);
          this.isValidSubmit = false;
          if (err.error) {
            this._toaster.error(err.error.message, "");
          }
        })
    }
  }

  ngOnDestroy(): void {
    this.createLogin({});
  }
}
