import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';

import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { ChangePwdComponent } from '../change-pwd/change-pwd.component';

import { CommonModule } from '@angular/common';

import { LoadingService } from 'src/app/theme/shared/services/loading.service';
import { ApiService } from 'src/app/theme/shared/services/api.service';
import { AuthService } from 'src/app/theme/shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { MainService } from 'src/app/theme/shared/services/main.service';

import { Response, User } from 'src/app/theme/shared/modals/common.modal';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    EditProfileComponent,
    ChangePwdComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export default class ProfileComponent implements OnInit, OnDestroy {

  editprofile: boolean;

  profiledetails: User = {
    name: '',
    mobile: '',
    email: '',
    profile_id: '',
    profileUrl: ''
  };
  profileUrl: string;
  default_img: string = environment.default_img;

  constructor(private loadingService: LoadingService, 
    private  _toaster: ToastrService,
    private _api: ApiService,
    private _auth: AuthService,
    private _main: MainService) {}

  ngOnInit(): void {
    this.getprofiledetails();
  }

  getprofiledetails() {
    this._main.profileData$.subscribe(
      (res: any) => {
        if(res && res.name != '') {
          this.profiledetails = res;
  
          this.editprofile = true;
        } else {
          this.getprofile();
        }
      }
    )
  }
 
  handleFileInput(event: any) {
    const file = event.target.files[0];
    // You can now use 'fileToUpload' for further operations like uploading to a server
    const type = file.type;

    if(type == "image/jpeg" || type == "image/png" || type == "image/jpg") {
      this.uploadProfile(file);
    } else {
      this._toaster.error("Upload a valid image. PNG and JPEG are the only formats allowed.");
    }
  }

  uploadProfile(file: any) {
    this.loadingService.setLoadingState(true);

    const fd = new FormData();
    fd.append('profile', file);

    this._api.request('post', '/uploadprofile', { formData: fd })
      .subscribe(
      (res: Response) => {
        if(res) {
          this.getprofile();
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

  getprofile() {
    this.loadingService.setLoadingState(true);
    this._api.request('get', '/getprofile').
    subscribe(
      (res: Response) => {
        if(res) {
          this._main.updateprofiledata(res.data);
          this.profiledetails = res.data;
          this.editprofile = true;
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

  handleImageError(event: any) {
    // Handle image loading error here
    // console.log('Error loading image:', event);
    // Optionally, you can set a fallback image URL
    this.profiledetails.profileUrl = this.default_img;
  }

  chnagerouter() {
    this.editprofile = !this.editprofile
  }

  ngOnDestroy(): void {
    
  }
}
