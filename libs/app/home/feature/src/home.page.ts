import { Component, HostListener } from '@angular/core';
import { Role } from '@event-participation-trends/api/user/util';
import { AppApiService } from '@event-participation-trends/app/api';
import { ProfileComponent } from '@event-participation-trends/app/profile/feature';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'event-participation-trends-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css'],
})
export class HomePage {
  selected = 'Users';
  usersSelected = true;
  viewSelected = false;
  compareSelected = false;
  
  public open = false;
  public role = Role.VIEWER;
  public username = '';
  public profilePicUrl = '';
  public faultyImage = false;

  constructor(private appApiService: AppApiService, private readonly modalController: ModalController) {
    this.appApiService.getRole().subscribe((response)=>{
      this.role = (response.userRole as Role) || Role.VIEWER;
    });
    this.appApiService.getUserName().subscribe((response)=>{
      this.username = response.username || '';
    });    
    this.appApiService.getProfilePicUrl().subscribe((response)=>{
      this.profilePicUrl = response.url || '';
      if (this.profilePicUrl === '') {
        this.faultyImage = true;
      }
    });
  }

  selectTab(option: string) {
    this.selected = option;

    if (option === 'Users') {
      this.usersSelected = true;
      this.viewSelected = false;
      this.compareSelected = false;
    } else if (option === 'View') {
      this.usersSelected = false;
      this.viewSelected = true;
      this.compareSelected = false;
    } else if (option === 'Compare Events') {
      this.usersSelected = false;
      this.viewSelected = false;
      this.compareSelected = true;
    }
  }

  allowUsers(): boolean {
    return this.role === 'admin';
  }

  allowView(): boolean {
    return this.role === 'manager' || this.role === 'admin';
  }

  allowCompare(): boolean {
    return this.role === 'manager' || this.role === 'admin';
  }

  getRole(): Role {
    return this.role;
  }

  isLargeScreen = false;

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 1310;
  }

  async openProfile(event: any) {
    const modal = await this.modalController.create({
      component: ProfileComponent,
      componentProps: {
        event: event,
      },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
  }
}