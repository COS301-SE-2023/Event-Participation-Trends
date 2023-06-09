import { Component, HostListener } from '@angular/core';
import { Role } from '@event-participation-trends/api/user/util';
import { AppApiService } from '@event-participation-trends/app/api';

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

  public role = Role.VIEWER;
  constructor(private appApiService: AppApiService) {
    this.appApiService.getRole().subscribe((response)=>{
      this.role = (response.userRole as Role) || Role.VIEWER;
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
    console.log(window.innerWidth);
  }
}
