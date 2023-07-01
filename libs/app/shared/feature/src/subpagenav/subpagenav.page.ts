import { Component, Input } from '@angular/core';
import { Role } from '@event-participation-trends/api/user/util';
import { AppApiService } from '@event-participation-trends/app/api';

@Component({
  selector: 'subpagenav',
  templateUrl: './subpagenav.page.html',
  styleUrls: ['./subpagenav.page.css'],
})
export class SubPageNavPage {
  @Input() currentPage!: string;
  public role = Role.VIEWER;  
  public appApiService: AppApiService;

  constructor(appApiService: AppApiService) {
    this.appApiService = appApiService;

    this.appApiService.getRole().subscribe((response)=>{
      this.role = (response.userRole as Role) || Role.VIEWER;
    });
  }

  getRole(): Role {
    return this.role;
  }
}
