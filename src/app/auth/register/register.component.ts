import { Component, OnInit, OnDestroy } from '@angular/core';

// Modules
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, ValidatorFn, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoadingService } from 'src/app/theme/shared/services/loading.service';
import { ApiService } from 'src/app/theme/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

import { Response } from 'src/app/theme/shared/modals/common.modal';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxTrimDirectiveModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  isSubmit: boolean = false;
  isValidSubmit: boolean = false;

  showpwd: boolean = false;
  showconfirmpwd: boolean = false;

  constructor(private _fb: FormBuilder, 
    private loadingService: LoadingService, 
    private  _toaster: ToastrService,
    private _api: ApiService,
    private _router: Router) {}

  ngOnInit(): void {
    this.createregister();
  }

  createregister() {
    this.registerForm = this._fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      mobile: ['', Validators.compose([Validators.required, Validators.pattern(/^((\+)?(\d{2}[-]))?(\d{10}){1}?$/)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/)])],
      password: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{6,50}$/)])],
      confirmpassword: ['', Validators.compose([Validators.required, passwordMatchValidator('password')])]
    })
  }

  get f() {
    return this.registerForm;
  }

  submit() {
    this.isSubmit = true;

    if (this.f.valid) {
      this.loadingService.setLoadingState(true);
      this.isValidSubmit = true;
      const authData = this.f.getRawValue();

      this._api.request('post', '/register', { body: authData })
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
    this.createregister();
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