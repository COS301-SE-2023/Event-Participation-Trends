import { AfterViewInit, Component, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppApiService } from '@event-participation-trends/app/api';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IUpdateEventDetailsRequest } from '@event-participation-trends/api/event/util';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { heroInboxSolid } from '@ng-icons/heroicons/solid';
import { matDeleteRound } from '@ng-icons/material-icons/round';
import { matCheckBox, matCancelPresentation } from '@ng-icons/material-icons/baseline';
import { DeleteConfirmModalComponent } from '../delete-confirm-modal/delete-confirm-modal.component';
import { ProducerComponent } from '../producer/producer.component';

@Component({
  selector: 'event-participation-trends-event-details-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIconsModule,
    DeleteConfirmModalComponent,
    ProducerComponent,
  ],
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.css'],
  providers: [provideIcons({ heroInboxSolid, matDeleteRound, matCheckBox, matCancelPresentation })],
})
export class EventDetailsPageComponent implements OnInit, AfterViewInit {
  @ViewChild('producer_component') producer_component!: ProducerComponent;
  constructor(
    private appApiService: AppApiService,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone
  ) {}
  
  async ngAfterViewInit(): Promise<void> {
    this.producer_component.eventID = this.id;
    await this.producer_component.connect();
  }

  public id = '';
  public event: any | null = null;
  public show = false;
  public loading = true;
  public requests: any[] = [];
  public invite = '';
  public showRequestBtnText = true;

  //event
  public location = '';
  public category = '';
  public start_time = '';
  public end_time = '';
  public isPublic = false;

  // old_event
  public old_location = '';
  public old_category = '';
  public old_start_time = '';
  public old_end_time = '';
  public old_isPublic = false;

  private time_offset = new Date().getTimezoneOffset();

  async ngOnInit() {
    
    this.id = this.route.parent?.snapshot.paramMap.get('id') || '';

    if (!this.id) {
      this.ngZone.run(() => { this.router.navigate(['/home']); });
    }

    this.event = (
      (await this.appApiService.getEvent({ eventId: this.id }))
    );

    if (this.event === null) {
      this.ngZone.run(() => { this.router.navigate(['/home']); });
    }

    if (!(await this.hasAccess())) {
      this.ngZone.run(() => { this.router.navigate(['/home']); });
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
      this.ngZone.run(() => { this.router.navigate(['/home']); });
    }

    this.requests = await this.appApiService.getAccessRequests({
      eventId: this.event._id,
    });

    this.old_category = this.category;
    this.old_location = this.location;
    this.old_isPublic = this.isPublic;
    this.old_start_time = this.start_time;
    this.old_end_time = this.end_time;

    // test if window size is less than 950px
    if ((window.innerWidth < 950 && window.innerWidth > 768) || window.innerWidth < 680) {
      this.showRequestBtnText = false;
    }
    else {
      this.showRequestBtnText = true;
    }  

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

    this.old_category = this.category;
    this.old_location = this.location;
    this.old_isPublic = this.isPublic;
    this.old_start_time = this.start_time;
    this.old_end_time = this.end_time;
  }

  discardChanges() {
    this.pressButton('#cancel_changes');

    this.category = this.old_category;
    this.location = this.old_location;
    this.isPublic = this.old_isPublic;
    this.start_time = this.old_start_time;
    this.end_time = this.old_end_time;
  }

  hasChanges() {
    return ( this.location !== this.old_location ||
      this.category !== this.old_category ||
      this.start_time !== this.old_start_time ||
      this.end_time !== this.old_end_time ||
      this.isPublic !== this.old_isPublic);
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

  inviteUser() {
    this.pressButton('#invite_user');

    console.log(this.invite);

    this.appApiService.acceptAccessRequest({
      userEmail: this.invite,
      eventId: this.event._id,
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if ((window.innerWidth < 950 && window.innerWidth > 768) || window.innerWidth < 680) {
      this.showRequestBtnText = false;
    } else {
      this.showRequestBtnText = true;
    } 
  }

  splitTitle(title: string): string[] {
    const maxLength = window.innerWidth < 768 ? 15 : 20;
    const parts = [];
  
    while (title.length > maxLength) {
      const spaceIndex = title.lastIndexOf(' ', maxLength);
      if (spaceIndex === -1) {
        // If there are no spaces, split at the maximum length
        parts.push(title.substring(0, maxLength));
        title = title.substring(maxLength);
      } else {
        // Otherwise, split at the last space before the maximum length
        parts.push(title.substring(0, spaceIndex));
        title = title.substring(spaceIndex + 1);
      }
    }
  
    if (title.length > 0) {
      parts.push(title);
    }
  
    return parts;
  }
  
}
