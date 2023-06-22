import { Time } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { IUser } from '@event-participation-trends/api/user/util';
import { AppApiService } from '@event-participation-trends/app/api';
import { Redirect } from '@nestjs/common';

interface Event {
  _id?: string;
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
  public appApiService: AppApiService;
  public accessRequests: any[] = [];
  constructor(appApiService: AppApiService, private route: ActivatedRoute, private router: Router) {
    this.initialText = 'Initial text value';
    this.inviteEmail = '';
    this.appApiService = appApiService;
    appApiService.getAccessRequests( {eventId : this.event._id} ).then((users) => {
      console.log('users', users);
      this.accessRequests = users;
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const id = params['id'];

      // TODO get event by id
      if (!id) {
        this.router.navigate(['/home']);
      }


    });
  }

  public event: Event = {
    _id: '648789728d8ed5b40edd0701',
    date: "2021-05-01",
    name: 'Polar Bear Plunge',
    location: 'Antarctica',
    category: 'Swimming',
    hasAccess: true,
    startsAt: '10:00',
    endsAt: '11:00',
  };

  
  overflow = false;
  show_invites = false;
  show_requests = false;

  removeRequest(accessRequest: any) {
    for (let i = 0; i < this.accessRequests.length; i++) {
      if (this.accessRequests[i]._id === accessRequest._id) {
        this.accessRequests.splice(i, 1);
        break;
      }
    }
  }

  acceptRequest(accessRequest: any) {
    this.appApiService.acceptAccessRequest({userEmail: accessRequest.Email, eventId: this.event._id}).then((respoonse) => {
      console.log('acceptAccessRequest', respoonse);
    });
    this.removeRequest(accessRequest);
  }

  declineRequest(accessRequest: any) {
    this.appApiService.declineAccessRequest({userEmail: accessRequest.Email, eventId: this.event._id});
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