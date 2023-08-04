import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { IEvent } from '@event-participation-trends/api/event/util';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroLockClosedSolid, heroInboxSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'event-participation-trends-all-events-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  templateUrl: './all-events-page.component.html',
  styleUrls: ['./all-events-page.component.css'],
  providers: [provideIcons({ heroLockClosedSolid, heroInboxSolid })],
})
export class AllEventsPageComponent implements OnInit {
  constructor(private appApiService: AppApiService) {}

  public all_events: any[] = [];
  public subscribed_events: any[] = [];
  public non_subscribed_events: any[] = [];
  public my_events: any[] = [];
  public role = 'viewer';
  public search = '';
  public loading = true;
  public show = false;
  public prev_scroll = 0;
  public show_search = true;
  public disable_search = false;
  public show_all_events = true;

  async ngOnInit() {
    this.role = await this.appApiService.getRole();

    this.all_events = await this.appApiService.getAllEvents();
    this.my_events = await this.appApiService.getManagedEvents();

    if (this.role !== 'admin') {
      this.subscribed_events = await this.appApiService.getSubscribedEvents();
      this.non_subscribed_events = this.all_events.filter((event: any) => {
        return (
          !this.hasAccess(event) &&
          this.my_events.filter((my_event) => {
            return my_event._id == event._id;
          }).length == 0
        );
      });
    }

    this.loading = false;
    setTimeout(() => {
      this.show = true;
    }, 300);
  }

  showAllEvents() {
    this.show_all_events = true;
  }

  showMyEvents() {
    this.show_all_events = false;
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
    if (this.role == 'admin') {
      return this.get_all_events().length == 0;
    } else {
      return (
        this.get_subscribed_events().length == 0 &&
        this.get_non_subscribed_events().length == 0
      );
    }
  }

  hasAccess(event: any): boolean {
    for (let i = 0; i < this.subscribed_events.length; i++) {
      if (this.subscribed_events[i]._id == event._id) {
        return true;
      }
    }

    return false;
  }

  get_all_events(): any[] {
    return this.all_events.filter((event) => {
      return event.Name
        ? event.Name.toLowerCase().includes(this.search.toLowerCase())
        : false;
    });
  }

  get_subscribed_events(): any[] {
    return this.subscribed_events.filter((event) => {
      return event.Name
        ? event.Name.toLowerCase().includes(this.search.toLowerCase())
        : false;
    });
  }

  get_non_subscribed_events() {
    return this.non_subscribed_events.filter((event) => {
      return event.Name
        ? event.Name.toLowerCase().includes(this.search.toLowerCase())
        : false;
    });
  }

  isAdmin() {
    return this.role === 'admin';
  }

  isManager() {
    return this.role === 'manager';
  }

  isViewer() {
    return this.role === 'viewer';
  }
}
