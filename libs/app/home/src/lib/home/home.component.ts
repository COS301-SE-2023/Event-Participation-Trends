import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { OnInit, AfterViewInit } from '@angular/core';
import { ProfileComponent } from '@event-participation-trends/app/components';
import { timeout } from 'rxjs';

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
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('gradient') gradient!: ElementRef<HTMLDivElement>;
  
  public tab = Tab.Events;
  public role = Role.Admin;
  public username = '';
  public img_url = '';

  constructor(private appApiService: AppApiService) {}

  async ngOnInit() {
    this.username = await this.appApiService.getUserName();
    this.img_url = await this.appApiService.getProfilePicUrl();
  }

  ngAfterViewInit() {
    document.addEventListener("mousemove", (event) => {
      const xPos = event.clientX / window.innerWidth;
      const yPos = event.clientY / window.innerHeight;
      this.gradient.nativeElement.style.backgroundImage = `radial-gradient(at ${xPos*100}% ${yPos*100}%, #1d1f26, #101010)`;
    });
    this.gradient.nativeElement.style.backgroundImage = `radial-gradient(at 50% 50%, #1d1f26, #101010)`;
  }

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
    this.pressButton('#events-link');
  }

  users() {
    this.pressButton('#users-link');
  }

  compare() {
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
