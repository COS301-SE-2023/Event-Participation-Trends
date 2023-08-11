import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppApiService } from '@event-participation-trends/app/api';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IUpdateEventDetailsRequest } from '@event-participation-trends/api/event/util';

@Component({
  selector: 'event-participation-trends-event-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.css'],
})
export class EventDetailsPageComponent implements OnInit {

  constructor(private appApiService: AppApiService, private router : Router, private route: ActivatedRoute) {}

  public id = '';
  public event : any | null = null;
  public show = false;
  public loading = true;

  //event
  public location = '';
  public category = '';
  public start_time = '';
  public end_time = '';

  private time_offset = new Date().getTimezoneOffset();

  async ngOnInit() {
    
    this.id = this.route.parent?.snapshot.paramMap.get('id') || '';

    if (!this.id) {
      this.router.navigate(['/']);
    }

    this.event = (await this.appApiService.getEvent({ eventId: this.id }) as any).event;

    this.location = this.event.Location.StreetName;
    this.category = this.event.Category;
    
    const localStartTime = new Date(new Date(this.event.StartDate).getTime() - this.time_offset * 60 * 1000);
    const localEndTime = new Date(new Date(this.event.EndDate).getTime() - this.time_offset * 60 * 1000);

    this.start_time = new Date(localStartTime).toISOString().slice(0, 16);
    this.end_time = new Date(localEndTime).toISOString().slice(0, 16);

    console.log(this.start_time);
    console.log(this.end_time);

    if (this.event === null) {
      this.router.navigate(['/home']);
    }
    
    this.loading = false;
    setTimeout(() => {
      this.show = true;
    }, 200);

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
        Location: this.event.Location,
        StartDate: db_start,
        EndDate: db_end,
      }
    }
    this.appApiService.updateEventDetails(updateDetails);
  }

  discardChanges() {
    this.pressButton('#cancel_changes');

    this.location = this.event.Location.StreetName;
    this.category = this.event.Category;
    this.start_time = new Date(this.event.StartDate).toISOString().slice(0, 16);
    this.end_time = new Date(this.event.EndDate).toISOString().slice(0, 16);
  }

  hasChanges() {
    return this.location !== this.event.Location.StreetName ||
      this.category !== this.event.Category ||
      this.start_time !== new Date(this.event.StartDate).toISOString().slice(0, 16) ||
      this.end_time !== new Date(this.event.EndDate).toISOString().slice(0, 16);
  }

}
