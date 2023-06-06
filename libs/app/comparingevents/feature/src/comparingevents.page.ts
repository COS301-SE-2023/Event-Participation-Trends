import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'event-participation-trends-comparingevents',
  templateUrl: './comparingevents.page.html',
  styleUrls: ['./comparingevents.page.css'],
})
export class ComparingeventsPage {
  @ViewChild('content-body', { static: true }) contentBody!: ElementRef;

  selectedEvents: any[] = [];

  constructor(private containerElement: ElementRef) {}
  overflow = false;

  ngAfterViewInit() {
    this.checkOverflow();
  }

  checkOverflow() {
    const container = this.containerElement.nativeElement;
    this.overflow = container.scrollHeight > container.clientHeight;
  }

  // define events array
  events = [
    {
      id: 1,
      name: 'Event 1',
      date: '2021-01-01',
      location: 'Location 1',
      description: 'Description 1',
      selected: false,
    },
    {
      id: 2,
      name: 'Event 2',
      date: '2021-01-02',
      location: 'Location 2',
      description: 'Description 2',
      selected: false,
    },
    {
      id: 3,
      name: 'Event 3',
      date: '2021-01-03',
      location: 'Location 3',
      description: 'Description 3',
      selected: false,
    },
    {
      id: 4,
      name: 'Event 4',
      date: '2021-01-04',
      location: 'Location 4',
      description: 'Description 4',
      selected: false,
    },
    {
      id: 5,
      name: 'Event 5',
      date: '2021-01-01',
      location: 'Location 5',
      description: 'Description 5',
      selected: false,
    },
    {
      id: 6,
      name: 'Event 6',
      date: '2021-01-02',
      location: 'Location 6',
      description: 'Description 6',
      selected: false,
    },
    {
      id: 7,
      name: 'Event 7',
      date: '2021-01-03',
      location: 'Location 7',
      description: 'Description 7',
      selected: false,
    },
    {
      id: 8,
      name: 'Event 8',
      date: '2021-01-04',
      location: 'Location 8',
      description: 'Description 8',
      selected: false,
    },
  ];

  maxSelectionReached = false;

  toggleItemSelection(event: any) {
    if (this.selectedEvents.includes(event)) {
      // Remove from selectedEvents
      this.selectedEvents = this.selectedEvents.filter(
        (selectedEvent) => selectedEvent !== event
      );
      event.selected = false;
    } else if (this.selectedEvents.length < 2) {
      // Add to selectedEvents
      event.selected = true;
      this.selectedEvents.push(event);
    }

    if (this.selectedEvents.length < 2) {
      this.maxSelectionReached = false;
    } else {
      this.maxSelectionReached = true;
    }
  }

  isItemDisabled(event: any): boolean {
    return this.isMaxSelectionReached() && !this.isSelected(event);
  }

  isMaxSelectionReached(): boolean {
    return this.maxSelectionReached && this.selectedEvents.length >= 2;
  }

  isSelected(event: any): boolean {
    return event.selected;
  }
}
