import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppApiService } from '@event-participation-trends/app/api';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IUpdateEventDetailsRequest } from '@event-participation-trends/api/event/util';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { heroInboxSolid } from '@ng-icons/heroicons/solid';
import { matDeleteRound } from '@ng-icons/material-icons/round';
import { DeleteConfirmModalComponent } from '../delete-confirm-modal/delete-confirm-modal.component';

@Component({
  selector: 'event-participation-trends-event-details-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIconsModule,
    DeleteConfirmModalComponent,
  ],
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.css'],
  providers: [provideIcons({ heroInboxSolid, matDeleteRound })],
})
export class EventDetailsPageComponent implements OnInit {
  constructor(
    private appApiService: AppApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public id = '';
  public event: any | null = null;
  public show = false;
  public loading = true;
  public requests: any[] = [];

  //event
  public location = '';
  public category = '';
  public start_time = '';
  public end_time = '';
  public isPublic = false;

  private time_offset = new Date().getTimezoneOffset();

  async ngOnInit() {
    
    this.id = this.route.parent?.snapshot.paramMap.get('id') || '';

    if (!this.id) {
      this.router.navigate(['/home']);
    }

    this.event = (
      (await this.appApiService.getEvent({ eventId: this.id })) as any
    ).event;

    if (this.event === null) {
      this.router.navigate(['/home']);
    }

    if (!(await this.hasAccess())) {
      this.router.navigate(['/home']);
    }

    this.location = this.event.Location;
    this.category = this.event.Category;
    this.isPublic = this.event.PublicEvent;

    const localStartTime = new Date(
      new Date(this.event.StartDate).getTime() - this.time_offset * 60 * 1000
    );
    const localEndTime = new Date(
      new Date(this.event.EndDate).getTime() - this.time_offset * 60 * 1000
    );

    this.start_time = new Date(localStartTime).toISOString().slice(0, 16);
    this.end_time = new Date(localEndTime).toISOString().slice(0, 16);

    this.event.StartDate = localStartTime;
    this.event.EndDate = localEndTime;

    if (this.event === null) {
      this.router.navigate(['/home']);
    }

    this.requests = await this.appApiService.getAccessRequests({
      eventId: this.event._id,
    });

    this.loading = false;
    setTimeout(() => {
      this.show = true;
    }, 200);
  }

  getEventID() {
    if (this.event) {
      return this.event._id;
    }
    return '';
  }

  async hasAccess() : Promise<boolean> {
    const role = await this.appApiService.getRole();

    if (role === 'admin') {
      return new Promise((resolve) => {
        resolve(true);
      });
    }

    if (role === 'viewer') {
      return new Promise((resolve) => {
        resolve(this.event.PublicEvent);
      });
    }

    const managed_events = await this.appApiService.getManagedEvents();

    for (let i = 0; i < managed_events.length; i++) {
      if ((managed_events[i] as any)._id === this.id) {
        return new Promise((resolve) => {
          resolve(true);
        });
      }
    }

    return new Promise((resolve) => {
      resolve(false);
    });
  }

  pressButton(id: string) {
    const target = document.querySelector(id);

    target?.classList.add('hover:scale-[90%]');
    setTimeout(() => {
      target?.classList.remove('hover:scale-[90%]');
    }, 100);
  }

  editFloorplan() {
    this.pressButton('#edit_floorplan');
    // this.router.navigate([`/event/${this.id}/edit`]);
  }

  saveEvent() {
    this.pressButton('#save_event');

    const db_start = new Date(new Date(this.start_time).getTime());
    const db_end = new Date(new Date(this.end_time).getTime());

    const updateDetails: IUpdateEventDetailsRequest = {
      eventId: this.event._id,
      eventDetails: {
        Name: this.event.name,
        Category: this.category,
        Location: this.location,
        PublicEvent: this.isPublic,
        StartDate: db_start,
        EndDate: db_end,
      },
    };

    this.appApiService.updateEventDetails(updateDetails);

    this.event.Location = this.location;
    this.event.Category = this.category;
    this.event.PublicEvent = this.isPublic;
    this.event.StartDate = db_start;
    this.event.EndDate = db_end;
  }

  discardChanges() {
    this.pressButton('#cancel_changes');

    this.location = this.event.Location;
    this.category = this.event.Category;
    this.isPublic = this.event.PublicEvent;
    this.start_time = new Date(this.event.StartDate).toISOString().slice(0, 16);
    this.end_time = new Date(this.event.EndDate).toISOString().slice(0, 16);
  }

  hasChanges() {
    return (
      this.location !== this.event.Location ||
      this.category !== this.event.Category ||
      this.start_time !==
        new Date(this.event.StartDate).toISOString().slice(0, 16) ||
      this.end_time !==
        new Date(this.event.EndDate).toISOString().slice(0, 16) ||
      this.isPublic !== this.event.PublicEvent
    );
  }

  removeRequest(request: any) {
    for (let i = 0; i < this.requests.length; i++) {
      if (this.requests[i]._id === request._id) {
        this.requests.splice(i, 1);
        break;
      }
    }
  }

  acceptRequest(request: any) {
    this.appApiService.acceptAccessRequest({
      userEmail: request.Email,
      eventId: this.event._id,
    });
    this.removeRequest(request);
  }

  declineRequest(request: any) {
    this.appApiService.declineAccessRequest({
      userEmail: request.Email,
      eventId: this.event._id,
    });
    this.removeRequest(request);
  }

  emptyRequests() {
    return this.requests.length === 0;
  }

  deleteEvent() {
    this.pressButton('#delete_event');

    setTimeout(() => {
      const modal = document.querySelector('#delete-modal');

      modal?.classList.remove('hidden');
      setTimeout(() => {
        modal?.classList.remove('opacity-0');
      }, 50);
    }, 200);
  }
}
