import { Component } from '@angular/core';

interface Event {
  name: string;
  location: string;
  category: string;
  hasAccess: boolean;
}

@Component({
  selector: 'event-participation-trends-viewevents',
  templateUrl: './viewevents.page.html',
  styleUrls: ['./viewevents.page.css'],
})
export class VieweventsPage {
  events: Event[] = [
    // Mock event names, categories and locations. They have to be believable.
    {
      name: 'Polar Bear Plunge',
      location: 'Antarctica',
      category: 'Swimming',
      hasAccess: true,
    },
    {
      name: 'The Great Wall Marathon',
      location: 'China',
      category: 'Running',
      hasAccess: true,
    },
    {
      name: 'The Color Run',
      location: 'United States',
      category: 'Running',
      hasAccess: true,
    },
    {
      name: 'The Great Barrier Reef Marathon Festival',
      location: 'Australia',
      category: 'Running',
      hasAccess: false,
    },
    {
      name: 'The Great Wall Marathon',
      location: 'China',
      category: 'Running',
      hasAccess: false,
    }    
  ];
}
