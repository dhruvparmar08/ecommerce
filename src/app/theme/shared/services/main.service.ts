import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../modals/common.modal';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  profileData = new BehaviorSubject<User>({
    name: '',
    mobile: '',
    email: '',
    profile_id: '',
    profileUrl: ''
  });

  profileData$ = this.profileData.asObservable();

  constructor() { }

  updateprofiledata(data: User) {
    return this.profileData.next(data);
  }

  getProfileData(): User {
    return this.profileData.getValue();
  }
}
