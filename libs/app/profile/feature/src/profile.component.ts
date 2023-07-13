import { Component } from '@angular/core';
import { Role } from '@event-participation-trends/api/user/util';
import { AppApiService } from '@event-participation-trends/app/api';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'event-participation-trends-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {

  public role = Role.VIEWER;
  public username = '';
  public fullName = '';
  public profilePicUrl = '';
  public email = '';
  public faultyImage = false;

  constructor(private appApiService: AppApiService, private readonly modalController: ModalController) {
    this.appApiService.getRole().subscribe((response)=>{
      this.role = (response.userRole as Role) || Role.VIEWER;
    });
    this.appApiService.getUserName().subscribe((response)=>{
      this.username = response.username || '';
    });
    this.appApiService.getFullName().subscribe((response)=>{
      this.fullName = response.fullName || '';
    });
    this.appApiService.getProfilePicUrl().subscribe((response)=>{
      this.profilePicUrl = response.url || '';
      if (this.profilePicUrl === '') {
        this.faultyImage = true;
      }
    });
    this.appApiService.getEmail().subscribe((response)=>{
      this.email = response.email || '';
    });
  }

  closeProfile() {
    this.modalController.dismiss();
  }

  logout() {
    // clear jwt token
    localStorage.removeItem('token');
    this.modalController.dismiss();

    // redirect to login page
    window.location.href = '/';
  }
}
