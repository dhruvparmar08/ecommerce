import { Component, OnInit, OnDestroy } from '@angular/core';

// Modules
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoadingService } from 'src/app/theme/shared/services/loading.service';
import { ApiService } from 'src/app/theme/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

import { Response } from 'src/app/theme/shared/modals/common.modal';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxTrimDirectiveModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})

export class ForgotPasswordComponent implements OnInit, OnDestroy {

  forgotpwdForm: FormGroup;
  isSubmit: boolean = false;
  isValidSubmit: boolean = false;

  showpwd: boolean = false;

  constructor(private _fb: FormBuilder, 
    private loadingService: LoadingService, 
    private  _toaster: ToastrService,
    private _api: ApiService,
    private _router: Router,) {}

  ngOnInit(): void {
    this.createforgotpwd();
  }

  createforgotpwd() {
    this.forgotpwdForm = this._fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/)])]
    })
  }

  get f() {
    return this.forgotpwdForm;
  }

  submit() {
    this.isSubmit = true;

    if (this.f.valid) {
      this.loadingService.setLoadingState(true);
      this.isValidSubmit = true;
      const authData = this.f.getRawValue();

      this._api.request('post', '/forgotpassword', { body: authData })
      .subscribe(
        (res: Response) => {
          this.loadingService.setLoadingState(false);
          this.isValidSubmit = false;

          if (res.success) {
            this._toaster.success(res.message, "");

            this._router.navigateByUrl('/auth/login');
          } else {
            this._toaster.error(res.message, "");
          }
        }, (err) => {
          this.loadingService.setLoadingState(false);
          this.isValidSubmit = false;
          if (err.error) {
            this._toaster.error(err.error.message, "");
          }
        })
    }
  }

  ngOnDestroy(): void {
    this.createforgotpwd();
  }
}
