import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { IEvent } from '@event-participation-trends/api/event/util';

@Component({
  selector: 'event-participation-trends-all-events-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-events-page.component.html',
  styleUrls: ['./all-events-page.component.css'],
})
export class AllEventsPageComponent implements OnInit {

  constructor(private appApiService: AppApiService) {}

  public all_events: IEvent[] = [];
  public subscribed_events: IEvent[] = [];
  public role = 'viewer';

  async ngOnInit() {

    this.role = await this.appApiService.getRole();

    this.all_events = await this.appApiService.getAllEvents();

    if (this.role !== 'admin') {
      this.subscribed_events = await this.appApiService.getSubscribedEvents();
    }

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
