import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { IEvent } from '@event-participation-trends/api/event/util';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroLockClosedSolid, heroInboxSolid } from '@ng-icons/heroicons/solid';
import { matPlusRound } from '@ng-icons/material-icons/round';
import { Router } from '@angular/router';
import { CreateEventModalComponent } from '../create-event-modal/create-event-modal.component';

@Component({
  selector: 'event-participation-trends-all-events-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIconComponent,
    CreateEventModalComponent,
  ],
  templateUrl: './all-events-page.component.html',
  styleUrls: ['./all-events-page.component.css'],
  providers: [
    provideIcons({ heroLockClosedSolid, heroInboxSolid, matPlusRound }),
  ],
})
export class AllEventsPageComponent implements OnInit {
  constructor(private appApiService: AppApiService, private router: Router) {}

  public all_events: any[] = [];
  public subscribed_events: any[] = [];
  public non_subscribed_events: any[] = [];
  public my_events: any[] = [];
  public role = 'viewer';
  public search = '';
  public loading = true;
  public show = false;
  public prev_scroll = 0;
  public show_search = true;
  public disable_search = false;
  public show_all_events = true;

  public create = false;

  async ngOnInit() {
    this.role = await this.appApiService.getRole();

    this.all_events = await this.appApiService.getAllEvents();
    if (this.role === 'manager') {
      this.my_events = await this.appApiService.getManagedEvents();
    }

    if (this.role !== 'admin') {
      this.subscribed_events = await this.appApiService.getSubscribedEvents();
      this.non_subscribed_events = this.all_events.filter((event: any) => {
        return (
          !this.hasAccess(event) &&
          this.my_events.filter((my_event) => {
            return my_event._id == event._id;
          }).length == 0
        );
      });
    }

    this.loading = false;
    setTimeout(() => {
      this.show = true;
    }, 300);
  }

  showAllEvents() {
    this.show_all_events = true;
  }

  showMyEvents() {
    this.show_all_events = false;
  }

  getURL(event: any) {
    if (this.role == 'admin') {
      this.router.navigate(['/event/' + event._id + '/details']);
    } else if (this.role == 'manager' && this.hasAccess(event)) {
      this.router.navigate(['/event/' + event._id + '/details']);
    } else {
      this.router.navigate(['/event/' + event._id + '/dashboard']);
    }
  }

  hasFloorplan(event: any): boolean {
    return event.FloorLayout ? true : false;
  }

  onScroll(event: any) {
    if (
      event.target.scrollTop < this.prev_scroll ||
      event.target.scrollTop == 0
    ) {
      this.disable_search = false;
      this.show_search = true;
    } else if (event.target.scrollTop > 150) {
      this.show_search = false;
      setTimeout(() => {
        this.disable_search = true;
      }, 300);
    }

    this.prev_scroll = event.target.scrollTop;
  }

  emptySearch(): boolean {
    if (this.role == 'admin') {
      return this.get_all_events().length == 0;
    } else {
      return (
        this.get_subscribed_events().length == 0 &&
        this.get_non_subscribed_events().length == 0
      );
    }
  }

  hasAccess(event: any): boolean {
    for (let i = 0; i < this.subscribed_events.length; i++) {
      if (this.subscribed_events[i]._id == event._id) {
        return true;
      }
    }

    return false;
  }

  get_all_events(): any[] {
    return this.sort_by_enddate(this.all_events.filter((event) => {
      return event.Name
        ? event.Name.toLowerCase().includes(this.search.toLowerCase())
        : false;
    }));
  }

  get_subscribed_events(): any[] {
    return this.subscribed_events.filter((event) => {
      return event.Name
        ? event.Name.toLowerCase().includes(this.search.toLowerCase())
        : false;
    });
  }

  get_non_subscribed_events() {
    return this.non_subscribed_events.filter((event) => {
      return event.Name
        ? event.Name.toLowerCase().includes(this.search.toLowerCase())
        : false;
    });
  }

  get_my_events(): any[] {
    return this.my_events.filter((event) => {
      return event.Name
        ? event.Name.toLowerCase().includes(this.search.toLowerCase())
        : false;
    });
  }

  sort_by_enddate(events: any[]): any[] {
    return events.sort((a, b) => {
      return new Date(b.EndDate).getTime() - new Date(a.EndDate).getTime();
    });
  }

  isAdmin() {
    return this.role === 'admin';
  }

  isManager() {
    return this.role === 'manager';
  }

  isViewer() {
    return this.role === 'viewer';
  }

  showCreate() {
    const modal = document.querySelector('#create-modal');

    modal?.classList.remove('hidden');
    setTimeout(() => {
      modal?.classList.remove('opacity-0');
    }, 100);
  }

  convertDateFormat(inputDate: Date): string {
    const date = new Date(inputDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  getDate(inputDate: Date): string {
    const date = new Date(inputDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getTime(inputDate: Date): string {
    const date = new Date(inputDate);

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  calculatePercentageDone(startDate: Date, endDate: Date): number {
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    const currentDate = new Date();

    if (currentDate < startDate) {
      return 0; // Not started yet
    } else if (currentDate >= endDate) {
      return 100; // Already finished
    }

    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedDuration = currentDate.getTime() - startDate.getTime();
    const percentage = (elapsedDuration / totalDuration) * 100;

    console.log(startDate, endDate, Math.round(percentage));

    // round to 0 decimal places

    return Math.round(percentage);
  }

  isDone(endDate: Date) : boolean {
    endDate = new Date(endDate);

    const currentDate = new Date();

    return currentDate >= endDate;
  }
}
