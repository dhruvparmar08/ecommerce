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
import { MainService } from 'src/app/theme/shared/services/main.service';

import { Response, User } from 'src/app/theme/shared/modals/common.modal';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxTrimDirectiveModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})

export class EditProfileComponent implements OnInit, OnDestroy {
  
  profileForm: FormGroup;
  isSubmit: boolean = false;
  isValidSubmit: boolean = false;

  @Input() profileData: User; 

  constructor(private _fb: FormBuilder, 
    private loadingService: LoadingService, 
    private  _toaster: ToastrService,
    private _api: ApiService,
    private _router: Router,
    private _location: Location,
    private _main: MainService) {}

  ngOnInit(): void {
      this.createprofileForm();
  }

  createprofileForm() {
    this.profileForm = this._fb.group({
      name: [this.profileData.name, Validators.compose([Validators.required, Validators.minLength(3)])],
      mobile: [{value: this.profileData.mobile, disabled: true}, Validators.compose([Validators.required, Validators.pattern(/^((\+)?(\d{2}[-]))?(\d{10}){1}?$/)])],
      email: [{value: this.profileData.email, disabled: true}, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/)])]
    });
  }

  get f() {
    return this.profileForm;
  }

  submit() {
    this.isSubmit = true;

    if (this.f.valid) {
      this.loadingService.setLoadingState(true);
      this.isValidSubmit = true;
      const profileData = this.f.getRawValue();
      
      this._api.request('post', '/updateprofile', { body: profileData })
      .subscribe(
        (res: Response) => {
          this.loadingService.setLoadingState(false);
          this.isValidSubmit = false;

          if (res.success) {
            this._toaster.success(res.message, "");

            this.getprofile();
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

  getprofile() {
    this.loadingService.setLoadingState(true);
    this._api.request('get', '/getprofile').
    subscribe(
      (res: Response) => {
        if(res) {
          this._main.updateprofiledata(res.data);
          this._router.navigateByUrl('/main');
        }
        this.loadingService.setLoadingState(false);
      },(err) => {
        console.log("err ::", err);
        this.loadingService.setLoadingState(false);
        if (err.error) {
          this._toaster.error(err.error.message, "");
        }
      }
    )
  }

  cancel() {
    this.createprofileForm();
    this._location.back();
  }

  ngOnDestroy(): void {
    this.createprofileForm();
  }
}
