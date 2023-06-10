import { Time } from '@angular/common';
import { Component } from '@angular/core';

interface AccessRequest {
  id: number;
  email: string;
  timestamp: number;
}

interface Event {
  date: string;
  name: string;
  location: string;
  category: string;
  hasAccess: boolean;
  startsAt: string;
  endsAt: string;
}

@Component({
  selector: 'event-participation-trends-eventdetails',
  templateUrl: './eventdetails.page.html',
  styleUrls: ['./eventdetails.page.css'],
})
export class EventDetailsPage {

  public initialText: string;
  public inviteEmail: string;
  constructor() {
    this.initialText = 'Initial text value';
    this.inviteEmail = '';
  }

  public event: Event = {
    date: "2021-05-01",
    name: 'Polar Bear Plunge',
    location: 'Antarctica',
    category: 'Swimming',
    hasAccess: true,
    startsAt: '10:00',
    endsAt: '11:00',
  };

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
  
  overflow = false;
  show_invites = false;
  show_requests = false;

  removeRequest(accessRequest: AccessRequest) {
    for (let i = 0; i < this.accessRequests.length; i++) {
      if (this.accessRequests[i].id === accessRequest.id) {
        this.accessRequests.splice(i, 1);
        break;
      }
    }
  }

  allowAccess(accessRequest: AccessRequest) {
    console.log('allowAccess', accessRequest);
  }

  acceptRequest(accessRequest: AccessRequest) {
    this.removeRequest(accessRequest);
  }

  declineRequest(accessRequest: AccessRequest) {
    this.removeRequest(accessRequest);
  }

  isEmpty() {
    return this.accessRequests.length === 0;
  }

  showRequests() {
    this.show_requests = true;
  }

  hideRequests() {
    this.show_requests = false;
  }

  showInvites() {
    this.show_invites = true;
  }

  hideInvites() {
    this.show_invites = false;
  }

  sendInvite() {
    if (this.inviteEmail === '') {
      return;
    }
    console.log('sendInvite', this.inviteEmail);
  }
}