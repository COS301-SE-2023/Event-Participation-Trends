import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { OnInit, AfterViewInit } from '@angular/core';
import { ProfileComponent } from '@event-participation-trends/app/components';
import { timeout } from 'rxjs';

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

  constructor(private appApiService: AppApiService) {}

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

  // ngAfterViewInit() {
  //   document.addEventListener("mousemove", (event) => {
  //     const xPos = event.clientX / window.innerWidth;
  //     const yPos = event.clientY / window.innerHeight;
  //     this.gradient.nativeElement.style.backgroundImage = `radial-gradient(at ${xPos*100}% ${yPos*100}%, #1a1b22, #101010)`;
  //   });
  //   this.gradient.nativeElement.style.backgroundImage = `radial-gradient(at 50% 50%, #1d1f26, #101010)`;
  // }

  isManager(): boolean {
    return this.role === Role.Manager;
  }

  showModal() {
    const modal = document.querySelector('#profile-modal');

    modal?.classList.remove('hidden');
    setTimeout(() => {
      modal?.classList.remove('opacity-0');
    }, 100);
  }

  pressButton(id: string) {
    const target = document.querySelector(id);

    target?.classList.add('hover:scale-90');
    setTimeout(() => {
      target?.classList.remove('hover:scale-90');
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
    this.pressButton('#username');

    setTimeout(() => {
    this.showModal();
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
