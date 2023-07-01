import { Component } from '@angular/core';
import { IEvent } from '@event-participation-trends/api/event/util';
import { AppApiService } from '@event-participation-trends/app/api';

@Component({
  selector: 'event-participation-trends-managerevents',
  templateUrl: './managerevents.page.html',
  styleUrls: ['./managerevents.page.css'],
})
export class ManagerEventsPage {

  constructor(private appApiService: AppApiService) {
    // this.appApiService.getManagedEvents().then((events) => {
    //   this.events = events;
    // });
  }

  events: IEvent[] = [];
}
