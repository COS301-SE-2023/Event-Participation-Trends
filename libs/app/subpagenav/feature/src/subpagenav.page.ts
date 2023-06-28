import { Component, HostListener, Input } from '@angular/core';
import { Role } from '@event-participation-trends/api/user/util';
import { AppApiService } from '@event-participation-trends/app/api';

@Component({
  selector: 'subpagenav',
  templateUrl: './subpagenav.page.html',
  styleUrls: ['./subpagenav.page.css'],
})
export class SubPageNavPage {
  @Input() currentPage!: string;
  @Input() event: any;
  public role = Role.VIEWER;  
  public appApiService: AppApiService;
  selected = 'Dashboard';
  detailsSelected = false;
  dashboardSelected = true;

  constructor(appApiService: AppApiService) {
    this.appApiService = appApiService;

    this.appApiService.getRole().subscribe((response)=>{
      this.role = (response.userRole as Role) || Role.VIEWER;
    });
  }

  getRole(): Role {
    return this.role;
  }

  selectTab(option: string) {
    this.selected = option;

    if (option === 'Event Details') {
      this.detailsSelected = true;
      this.dashboardSelected = false;
    }
    else if (option === 'Dashboard') {
      this.detailsSelected = false;
      this.dashboardSelected = true;
    }
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
