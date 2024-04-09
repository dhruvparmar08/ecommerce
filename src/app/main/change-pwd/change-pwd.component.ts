import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, ValidatorFn, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoadingService } from 'src/app/theme/shared/services/loading.service';
import { ApiService } from 'src/app/theme/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/theme/shared/services/auth.service';

import { Response } from 'src/app/theme/shared/modals/common.modal';

@Component({
  selector: 'app-change-pwd',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxTrimDirectiveModule
  ],
  templateUrl: './change-pwd.component.html',
  styleUrl: './change-pwd.component.scss'
})

export class ChangePwdComponent implements OnInit, OnDestroy {

  changepwdForm: FormGroup;
  isSubmit: boolean = false;
  isValidSubmit: boolean = false;

  showoldpwd: boolean = false;
  showpwd: boolean = false;
  showconfirmpwd: boolean = false;

  constructor(private _fb: FormBuilder, 
    private loadingService: LoadingService, 
    private  _toaster: ToastrService,
    private _api: ApiService,
    private _router: Router,
    private _location: Location,
    private _auth: AuthService) {}

  ngOnInit(): void {
      this.createchangepwdForm();
  }

  createchangepwdForm() {
    this.changepwdForm = this._fb.group({
      oldpassword: ['', Validators.compose([Validators.required, Validators.minLength(6), OldpasswordMatchValidator('newpassword')])],
      newpassword: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{6,50}$/), OldpasswordMatchValidator('oldpassword')])],
      confirmpassword: ['', Validators.compose([Validators.required, passwordMatchValidator('newpassword')])]
    });
  }

  get f() {
    return this.changepwdForm;
  }

  submit() {
    this.isSubmit = true;

    if (this.f.valid) {
      this.loadingService.setLoadingState(true);
      this.isValidSubmit = true;
      const changepwdData = this.f.getRawValue();
      
      this._api.request('post', '/changepassword', { body: changepwdData })
      .subscribe(
        (res: Response) => {
          this.loadingService.setLoadingState(false);
          this.isValidSubmit = false;

          if (res.success) {
            this._toaster.success(res.message, "");

            this._auth.logout();
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

  cancel() {
    this.createchangepwdForm();
    this._location.back();
  }

  ngOnDestroy(): void {
    this.createchangepwdForm();
  }
}

function passwordMatchValidator(password: string): ValidatorFn {
  return (control: FormControl) => {
    // console.log(control)
    if (!control || !control.parent) {
      return null;
    }
    return control.parent.get(password).value === control.value ? null : { mismatch: true };
  };
}

function OldpasswordMatchValidator(password: string): ValidatorFn {
  return (control: FormControl) => {
    // console.log(control)
    if (!control || !control.parent) {
      return null;
    }
    return control.parent.get(password).value === control.value ? { match: true } : null;
  };
}