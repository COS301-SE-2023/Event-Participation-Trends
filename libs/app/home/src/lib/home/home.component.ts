import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { OnInit, AfterViewInit } from '@angular/core';
import { ProfileComponent } from '@event-participation-trends/app/components';
import { timeout } from 'rxjs';
import { set } from 'mongoose';
import { Router } from '@angular/router';

enum Tab {
  Events = 'events',
  Users = 'users',
  Compare = 'compare',
  None = '',
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
  @ViewChild('gradient') gradient!: ElementRef<HTMLDivElement>;
  
  public tab = Tab.None;
  public role = Role.Admin;
  public username = '';
  public img_url = '';

  // Navbar
  // Events
  public expandEvents = false;
  public overflowEvents = false;
  showEvents() {
    this.expandEvents = true;
    this.overflowEvents = true;
  }
  hideEvents() {
    this.expandEvents = false;
    setTimeout(() => {
      this.overflowEvents = false;
    }, 300);
  }

  // Compare
  public expandCompare = false;
  public overflowCompare = false;
  showCompare() {
    this.expandCompare = true;
    this.overflowCompare = true;
  }
  hideCompare() {
    this.expandCompare = false;
    setTimeout(() => {
      this.overflowCompare = false;
    }, 300);
  }

  // Users
  public expandUsers = false;
  public overflowUsers = false;
  showUsers() {
    this.expandUsers = true;
    this.overflowUsers = true;
  }
  hideUsers() {
    this.expandUsers = false;
    setTimeout(() => {
      this.overflowUsers = false;
    }, 300);
  }

  // Help
  public expandHelp = false;
  public overflowHelp = false;
  showHelp() {
    this.expandHelp = true;
    this.overflowHelp = true;
  }
  hideHelp() {
    this.expandHelp = false;
    setTimeout(() => {
      this.overflowHelp = false;
    }, 300);
  }

  constructor(private appApiService: AppApiService, private router: Router) {}

  async ngOnInit() {
    
    this.username = await this.appApiService.getUserName();
    this.img_url = await this.appApiService.getProfilePicUrl();
    const r = await this.appApiService.getRole();

    switch (r) {
      case 'admin':
        this.role = Role.Admin;
        break;
      case 'manager':
        this.role = Role.Manager;
        break;
      case 'viewer':
        this.role = Role.Viewer;
        break;
      default:
        this.role = Role.Viewer;
        break;
    }

    const t = window.location.href.split('/').pop();
    if (t === 'users') {
      this.tab = Tab.Users;
    }
    else if (t === 'compare') {
      this.tab = Tab.Compare;
    }
    else {
      this.tab = Tab.Events;
    }

  }

  isManager(): boolean {
    return this.role === Role.Manager;
  }

  isAdmin(): boolean {
    return this.role === Role.Admin;
  }

  showProfile() {
    const modal = document.querySelector('#profile-modal');

    modal?.classList.remove('hidden');
    setTimeout(() => {
      modal?.classList.remove('opacity-0');
    }, 100);
  }

  showHelpModal() {
    const modal = document.querySelector('#help-modal');

    modal?.classList.remove('hidden');
    setTimeout(() => {
      modal?.classList.remove('opacity-0');
    }, 100);
  }

  pressButton(id: string) {
    const target = document.querySelector(id);

    target?.classList.add('hover:scale-[80%]');
    setTimeout(() => {
      target?.classList.remove('hover:scale-[80%]');
    }, 100);
  }

  events() {
    this.tab = Tab.Events;
    this.pressButton('#events-link');
  }

  users() {
    this.tab = Tab.Users;
    this.pressButton('#users-link');
  }

  compare() {
    this.tab = Tab.Compare;
    this.pressButton('#compare-link');
  }

  profile_press() {
    this.pressButton('#profile-picture');

    setTimeout(() => {
      this.showProfile();
    }, 100);
  }

  home_press() {
    this.pressButton('#home-link');

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 100);
  }

  help_press() {
    this.pressButton('#help-link');
    
    setTimeout(() => {
      this.showHelpModal();
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
}
