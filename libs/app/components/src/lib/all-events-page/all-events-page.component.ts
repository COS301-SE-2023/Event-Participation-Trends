import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { IEvent } from '@event-participation-trends/api/event/util';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'event-participation-trends-all-events-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-events-page.component.html',
  styleUrls: ['./all-events-page.component.css'],
})
export class AllEventsPageComponent implements OnInit {

  constructor(private appApiService: AppApiService) {}

  public all_events: IEvent[] = [];
  public subscribed_events: IEvent[] = [];
  public non_subscribed_events: IEvent[] = [];
  public role = 'admin';
  public search = '';

  async ngOnInit() {

    this.role = await this.appApiService.getRole();

    this.all_events = await this.appApiService.getAllEvents();

    if (this.role !== 'admin') {
      this.subscribed_events = await this.appApiService.getSubscribedEvents();
      this.non_subscribed_events = this.all_events.filter((event) => {
        return !this.subscribed_events.some((subscribed_event) => {
          return subscribed_event.Name === event.Name;
        });
      });
    }

  }

  get_all_events() {
    return this.all_events.filter((event) => {
      return event.Name
        ? event.Name.toLowerCase().includes(this.search.toLowerCase())
        : false;
    });
  }

  get_subscribed_events() {
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
