import { Component } from '@angular/core';

interface Event {
  name: string;
  location: string;
  category: string;
  notification: boolean;
}

@Component({
  selector: 'event-participation-trends-managerevents',
  templateUrl: './managerevents.page.html',
  styleUrls: ['./managerevents.page.css'],
})
export class ManagerEventsPage {
  events: Event[] = [
    // Mock event names, categories and locations. They have to be believable.
    {
      name: 'Polar Bear Plunge',
      location: 'Antarctica',
      category: 'Swimming',
      notification: false,
    },
    {
      name: 'The Great Wall Marathon',
      location: 'China',
      category: 'Running',
      notification: true,
    },
    {
      name: 'The Color Run',
      location: 'United States',
      category: 'Running',
      notification: false,
    },
    {
      name: 'The Great Barrier Reef Marathon Festival',
      location: 'Australia',
      category: 'Running',
      notification: false,
    },
    {
      name: 'The Great Wall Marathon',
      location: 'China',
      category: 'Running',
      notification: true,
    }    
  ];
}
