import { Time } from '@angular/common';
import { Component } from '@angular/core';

interface AccessRequest {
  id: number;
  email: string;
  timestamp: number;
}

interface Event {
  name: string;
  location: string;
  category: string;
  hasAccess: boolean;
}

@Component({
  selector: 'event-participation-trends-eventdetails',
  templateUrl: './eventdetails.page.html',
  styleUrls: ['./eventdetails.page.css'],
})
export class EventDetailsPage {
  public initialText: string;
  constructor() {
    this.initialText = 'Initial text value';
  }

  public accessRequests: AccessRequest[] = [
    {
      id: 1,
      email: 'user_1@gmail.com',
      timestamp: 1620000000000,
    },
    {
      id: 2,
      email: 'user_2@gmail.com',
      timestamp: 1620000000000,
    },
  ];

  removeRequest(accessRequest: AccessRequest) {
    for (let i = 0; i < this.accessRequests.length; i++) {
      if (this.accessRequests[i].id === accessRequest.id) {
        this.accessRequests.splice(i, 1);
        break;
      }
    }
  event: Event = {
    name: 'Polar Bear Plunge',
    location: 'Antarctica',
    category: 'Swimming',
    hasAccess: true,
  };

  allowAccess(accessRequest: AccessRequest) {
    console.log('allowAccess', accessRequest);
  }

  acceptRequest(accessRequest: AccessRequest) {
    this.removeRequest(accessRequest);
  }

  declineRequest(accessRequest: AccessRequest) {
    this.removeRequest(accessRequest);
  }

  overflow = false;

  isEmpty() {
    return this.accessRequests.length === 0;
  }

  showRequests() {
    this.show_requests = true;
  }

  hideRequests() {
    this.show_requests = false;
  }

  show_requests = true;
  showRequests = false;
}
