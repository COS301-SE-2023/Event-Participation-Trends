import { Component } from '@angular/core';

@Component({
  selector: 'event-participation-trends-eventdetails',
  templateUrl: './eventdetails.page.html',
  styleUrls: ['./eventdetails.page.css'],
})
export class EventDetailsPage {
  isDropdownOpen = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}