// angular import
import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { LoadingService } from 'src/app/theme/shared/services/loading.service';
import { ApiService } from 'src/app/theme/shared/services/api.service';
import { AuthService } from 'src/app/theme/shared/services/auth.service';
import { MainService } from 'src/app/theme/shared/services/main.service';
import { ToastrService } from 'ngx-toastr';

import { Response } from 'src/app/theme/shared/modals/common.modal';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavRightComponent implements OnInit, OnDestroy {
  // public method
  profile = [
    {
      icon: 'ti ti-edit-circle',
      title: 'Edit Profile'
    },
    // {
    //   icon: 'ti ti-user',
    //   title: 'View Profile'
    // },
    // {
    //   icon: 'ti ti-clipboard',
    //   title: 'Social Profile'
    // },
    // {
    //   icon: 'ti ti-edit-circle',
    //   title: 'Billing'
    // },
    {
      icon: 'ti ti-power',
      title: 'Logout'
    }
  ];

  setting = [
    {
      icon: 'ti ti-help',
      title: 'Support'
    },
    {
      icon: 'ti ti-user',
      title: 'Account Settings'
    },
    {
      icon: 'ti ti-lock',
      title: 'Privacy Center'
    },
    {
      icon: 'ti ti-messages',
      title: 'Feedback'
    },
    {
      icon: 'ti ti-list',
      title: 'History'
    }
  ];

  username: string;
  profile_url: string;
  default_img: string = environment.default_img;

  profileSubscription: Subscription;

  constructor(
    private loadingService: LoadingService,
    private _toaster: ToastrService,
    private _api: ApiService,
    private _modalService: NgbModal,
    private _auth: AuthService,
    private _router: Router,
    private _main: MainService) {}

  ngOnInit(): void {
    this.getprofiledetails();
  }

  getprofiledetails() {
    this._main.profileData$.subscribe(
      (res: any) => {
        if(res && res.name != '') {
          this.username = res.name;
          this.profile_url = res.profileUrl;
        } else {
          this.getprofile();
        }
      }
    )
  }

  handleImageError(event: any) {
    // Handle image loading error here
    // console.log('Error loading image:', event);
    // Optionally, you can set a fallback image URL
    this.profile_url = this.default_img;
  }

  getprofile() {
    this.loadingService.setLoadingState(true);
    this._api.request('get', '/getprofile').
    subscribe(
      (res: Response) => {
        if(res) {
          this.username = res.data.name;
          this.profile_url = res.data.profileUrl;

          this._main.updateprofiledata(res.data);
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

  Redirection() {
    this._router.navigateByUrl('/main/profile');
  }

  logout() {
    this.loadingService.setLoadingState(true);
    this._api.request('get', '/logout')
    .subscribe(
      (res: Response) => {
        this._toaster.success(res.message, "");
        this.loadingService.setLoadingState(false);
        this._auth.logout();
      },(err) => {
        console.log("err ::", err);
        this.loadingService.setLoadingState(false);
        if (err.error) {
          this._toaster.error(err.error.message, "");
        }
      }
    )
  }

  openLogoutModal(content: TemplateRef<any>) {
		this._modalService.open(content, { centered: true }).result.then(
      (res: any) => {
        if(res == 'logout') {
          this.logout();
        }
      }
    );
	}

  ngOnDestroy(): void {
    
  }
}
