// angular import
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  // public props
  navCollapsed: boolean = true; // for sidebar do it to false
  navCollapsedMob: boolean = false;

  currentYear: number = new Date().getFullYear();

  // public method
  navMobClick() {
    if (this.navCollapsedMob && !document.querySelector('app-navigation.coded-navbar').classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }
}
