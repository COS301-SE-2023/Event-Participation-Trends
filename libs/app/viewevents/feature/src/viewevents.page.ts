import { Component } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { IEvent } from '@nestjs/cqrs';

@Component({
  selector: 'event-participation-trends-viewevents',
  templateUrl: './viewevents.page.html',
  styleUrls: ['./viewevents.page.css'],
})
export class VieweventsPage {
  constructor(private appApiService: AppApiService) {
    this.appApiService.getAllEvents().then((events) => {
      this.all_events = events;
      //this.subscribed_events = events;
    });

    this.appApiService.getManagedEvents().then((events) => {
      this.my_events = events;
      console.log(events);
    });
  }

  public all_events: any[] = [];
  public subscribed_events: any[] = [];

  public my_events: any[] = [];

  hasEvents(): boolean {
    return this.my_events.length > 0;
  }

  hasAccess(event: any): boolean {

    for (let i = 0; i < this.subscribed_events.length; i++) {
      if (this.subscribed_events[i]._id == event._id) {
        return true;
      }
    }

    return false;

  }

  requestAccess(event: any) {
    this.appApiService.sendViewRequest({eventId: event._id}).then((status) => {
      console.log(status);
    });
  }

  subscribedEvents(): any[] {
    return this.subscribed_events;
  }

  unsubscribedEvents(): any[] {
    return this.all_events.filter((event) => {
      return !this.hasAccess(event);
    });
  }

}
