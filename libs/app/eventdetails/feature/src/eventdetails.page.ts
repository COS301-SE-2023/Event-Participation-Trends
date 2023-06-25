import { Time } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { IUser, Role } from '@event-participation-trends/api/user/util';
import { AppApiService } from '@event-participation-trends/app/api';
import { Redirect } from '@nestjs/common';
import { IEvent, IEventDetails, IUpdateEventDetailsRequest } from '@event-participation-trends/api/event/util';
import { promisify } from 'util';

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
  public event: any = {};
  public role: Role = Role.VIEWER;
  public startDate = '';
  public endDate = '';
  public startTime = '';
  public endTime = '';
  public location = '';
  public category = '';
  public name = '';
  constructor(appApiService: AppApiService, private route: ActivatedRoute, private router: Router) {
    this.initialText = 'Initial text value';
    this.inviteEmail = '';
    this.appApiService = appApiService;

    this.route.queryParams.subscribe((params) => {
      const id = params['id'];

      this.appApiService.getRole().subscribe((response)=>{
        this.role = (response.userRole as Role) || Role.VIEWER;
      })
      this.appApiService.getAllEvents().subscribe((response)=>{
        this.event = response.events.find((event: any) => event._id === id);
        if(!this.event){
          this.router.navigateByUrl('/home');
        }
        this.startDate = this.event.StartDate.split('T')[0];
        this.endDate = this.event.EndDate.split('T')[0];
        this.startTime = this.event.StartDate.split('T')[1].split('.')[0];
        this.endTime = this.event.EndDate.split('T')[1].split('.')[0];
        this.location = this.event.Location.StreetName + ', ' + this.event.Location.CityName;
        this.category = this.event.Category;
        this.name = this.event.Name;
        console.log(this.event)
        appApiService.getAccessRequests( {eventId : this.event._id} ).then((users) => {
          console.log('users', users);
          this.accessRequests = users;
        });
      })
    });
  }

  
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

  save(){
    const updateDetails: IUpdateEventDetailsRequest = {
      eventId: this.event._id,
      eventDetails: {
        Name: this.name,
        Category: this.category,
        Location: this.event.Location,
        StartDate: new Date(this.startDate + 'T' + this.startTime),
        EndDate: new Date(this.endDate + 'T' + this.endTime),
      }
    }
    this.appApiService.updateEventDetails(updateDetails);
  }
}