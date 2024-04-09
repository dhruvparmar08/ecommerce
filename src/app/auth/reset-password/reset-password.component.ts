import { Component, OnInit, OnDestroy } from '@angular/core';

// Modules
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, ValidatorFn, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from 'src/app/theme/shared/services/auth.service';
import { LoadingService } from 'src/app/theme/shared/services/loading.service';
import { ApiService } from 'src/app/theme/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

import { ResetPWDToken } from 'src/app/theme/shared/modals/common.modal';
import { Response } from 'src/app/theme/shared/modals/common.modal';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxTrimDirectiveModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  resetpwdForm: FormGroup;
  isSubmit: boolean = false;
  isValidSubmit: boolean = false;

  showpwd: boolean = false;
  showconfirmpwd: boolean = false;

  tokenDetails: ResetPWDToken = null;

  currentTime = new Date();

  pageexpried: boolean = false;

  constructor(private _fb: FormBuilder,
    private loadingService: LoadingService, 
    private  _toaster: ToastrService,
    private _api: ApiService,
    private route: ActivatedRoute,
    private _router: Router,) {}

  ngOnInit(): void {
    this.createresetpwd();

    this.route.paramMap.subscribe(({params}: any) => {
      try {
        const tokenDetails = JSON.parse(atob(params.id));
        this.tokenDetails = {
          _id: tokenDetails._id,
          token: tokenDetails.token,
          generateTime: new Date(tokenDetails.generateTime)
        };

        const timediff = parseInt(((this.currentTime.getTime() - this.tokenDetails.generateTime.getTime()) / (60 * 1000)).toPrecision(2));
  
        if(timediff >= 30) {
          this.pageexpried = true;
        }
      } catch (err) {
        this.pageexpried = true;
        console.error("err", err);
      }
    });
  }

  createresetpwd() {
    this.resetpwdForm = this._fb.group({
      password: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{6,50}$/)])],
      confirmpassword: ['', Validators.compose([Validators.required, passwordMatchValidator('password')])]
    })
  }

  get f() {
    return this.resetpwdForm;
  }

  submit() {
    this.isSubmit = true;
    
    if (this.f.valid) {
      this.loadingService.setLoadingState(true);
      this.isValidSubmit = true;
      const authData = this.f.getRawValue();
      authData['resetpwdToken'] = this.tokenDetails.token;
      authData['id'] = this.tokenDetails._id;

      this._api.request('post', '/resetpassword', { body: authData })
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
    this.createresetpwd();
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
