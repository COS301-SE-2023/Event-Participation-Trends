import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppApiService } from '@event-participation-trends/app/api';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { Router } from '@angular/router';

@Component({
  selector: 'event-participation-trends-users-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css'],
})
export class UsersPageComponent implements OnInit {

  constructor(private appApiService: AppApiService, private router: Router) {}

  public users: any[] = [];
  public search = '';
  public loading = true;
  public show = false;
  public prev_scroll = 0;
  public show_search = true;
  public disable_search = false;
  public viewerText = 'V';
  public managerText = 'M';
  public largeScreen = false;

  async ngOnInit() {
    const role = await this.appApiService.getRole();

    if (role != 'admin') {
      this.router.navigate(['/home']);
    }

    this.users = await this.appApiService.getAllUsers();

    // test if window size is less than 700px
    if (window.innerWidth < 700) {
      this.viewerText = 'V';
      this.managerText = 'M';
    }
    else {
      this.viewerText = 'Viewer';
      this.managerText = 'Manager';
    }  

    if (window.innerWidth >= 1024) {
      this.largeScreen = true;
    } else {
      this.largeScreen = false;
    }

    this.loading = false;
    setTimeout(() => {
      this.show = true;
    }, 300);
  }

  get_users(): any[] {
    return this.users.filter((user) => {
      return user.FirstName.toLowerCase().includes(this.search.toLowerCase()) || user.LastName.toLowerCase().includes(this.search.toLowerCase()) || user.Email.toLowerCase().includes(this.search.toLowerCase()) || user.Role.toLowerCase().includes(this.search.toLowerCase());
    });
  }

  isViewer(user: any): boolean {
    return user.Role == 'viewer';
  }

  updateRole(user: any) {
    this.appApiService.updateUserRole({
      update: {
        UserEmail: user.Email,
        UpdateRole: user.Role,
      },
    });
  }

  getName(user: any): string {
    if (user.FirstName == null) {
      user.FirstName = '';
    }

    if (user.LastName == null) {
      user.LastName = '';
    }
    
    return user.FirstName + ' ' + user.LastName;
  }

  setViewer(user: any) {
    user.Role = 'viewer';
    this.updateRole(user);
  }

  setManager(user: any) {
    user.Role = 'manager';
    this.updateRole(user);
  }

  onScroll(event: any) {
    // If scrolling up, log 'top'
    if (event.target.scrollTop < this.prev_scroll || event.target.scrollTop == 0) {
      this.show_search = true;
      this.disable_search = false;
    } else if (event.target.scrollTop > this.prev_scroll) {
      this.show_search = false;
      setTimeout(() => {
        this.disable_search = true;
      }, 300);
    }

    this.prev_scroll = event.target.scrollTop;

  }

  emptySearch(): boolean {
    return this.get_users().length == 0;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth > 700) {
      this.viewerText = 'Viewer';
      this.managerText = 'Manager';
    } else {
      this.viewerText = 'V';
      this.managerText = 'M';
    } 

    if (window.innerWidth >= 1024) {
      this.largeScreen = true;
    } else {
      this.largeScreen = false;
    }
  }

}
