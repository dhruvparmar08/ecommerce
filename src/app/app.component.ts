// angular import
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InternetConnectivityService } from './theme/shared/services/internet-connectivity.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  // public props
  title = 'mantis-free-version';

  isOnline: boolean = true; // Initial assumption

  private internetSubscription: Subscription;

  constructor(private internetService: InternetConnectivityService,
    private _toaster: ToastrService) { }

  ngOnInit(): void {
    let internetCount = 0;
    this.internetSubscription = this.internetService.checkInternetConnectivity()
      .subscribe(online => {
        this.isOnline = online;

        if(this.isOnline) {
          if(internetCount != 0) {
            this._toaster.success('Your internet connection is established.');
          }
        } else {
          this._toaster.error('Connection Lost. Please check your Internet connection.');
        }

        internetCount++;
      });
  }

  ngOnDestroy(): void {
    if (this.internetSubscription) {
      this.internetSubscription.unsubscribe();
    }
  }
}
