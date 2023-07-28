import { Component } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { OnInit } from '@angular/core';

enum Tab {
  Events = 'events',
  Users = 'users',
  Compare = 'compare',
}

enum Role {
  Admin = 'admin',
  Manager = 'manager',
  Viewer = 'viewer',
}

@Component({
  selector: 'event-participation-trends-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public tab = Tab.Events;
  public role = Role.Admin;
  public username = '';
  public img_url = '';

  constructor(private appApiService: AppApiService) {}

  async ngOnInit() {
    this.username = await this.appApiService.getUserName();
    this.img_url = await this.appApiService.getProfilePicUrl();
  }

  events() {
    const mouseTarget = document.querySelector("#events_link");

    console.log(mouseTarget);

    mouseTarget?.classList.add("hover:scale-90");
    setTimeout(() => {
      mouseTarget?.classList.remove("hover:scale-90");
    }, 100);
  }

  users() {
    const mouseTarget = document.querySelector("#users_link");

    console.log(mouseTarget);

    mouseTarget?.classList.add("hover:scale-90");
    setTimeout(() => {
      mouseTarget?.classList.remove("hover:scale-90");
    }, 100);
  }

  compare() {
    const mouseTarget = document.querySelector("#compare_link");

    console.log(mouseTarget);

    mouseTarget?.classList.add("hover:scale-90");
    setTimeout(() => {
      mouseTarget?.classList.remove("hover:scale-90");
    }, 100);
  }

  onEvents(): boolean {
    return this.tab === Tab.Events;
  }

  onUsers(): boolean {
    return this.tab === Tab.Users;
  }

  onCompare(): boolean {
    return this.tab === Tab.Compare;
  }

  showUsers(): boolean {
    return this.role === Role.Admin;
  }

  showCompare(): boolean {
    return this.role === Role.Admin || this.role === Role.Manager;
  }
}
