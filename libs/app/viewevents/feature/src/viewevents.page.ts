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
      this.subscribed_events = events;
    });
  }

  public all_events: any[] = [];
  public subscribed_events: any[] = [];

  hasAccess(event: any): boolean {
    // if event in this.subscribed_events return true
    console.log(event);

    for (let i = 0; i < this.subscribed_events.length; i++) {
      console.log(this.subscribed_events[i]._id);
      if (this.subscribed_events[i]._id == event._id) {
        return true;
      }
    }

    return false;

  }
}
