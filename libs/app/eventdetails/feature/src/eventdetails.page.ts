import { Time } from '@angular/common';
import { Component } from '@angular/core';

interface AccessRequest {
  id: number;
  email: string;
  timestamp: number;
}
@Component({
  selector: 'event-participation-trends-eventdetails',
  templateUrl: './eventdetails.page.html',
  styleUrls: ['./eventdetails.page.css'],
})
export class EventDetailsPage {
  
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

  allowAccess(accessRequest: AccessRequest) {
    console.log('allowAccess', accessRequest);
  }

  denyAccess(accessRequest: AccessRequest) {
    console.log('denyAccess', accessRequest);
  }

  showRequests = true;
}
