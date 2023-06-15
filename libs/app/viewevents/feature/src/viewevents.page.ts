import { Component } from '@angular/core';
import { RequestAccessModalComponent } from '@event-participation-trends/app/requestaccessmodal/feature';
import { ViewEventModalComponent } from '@event-participation-trends/app/vieweventmodal/feature';
import { ModalController } from '@ionic/angular';

interface Event {
  eventId: string;
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
      eventId: '1',
      name: 'Polar Bear Plunge',
      location: 'Antarctica',
      category: 'Swimming',
      hasAccess: true,
    },
    {
      eventId: '2',
      name: 'The Great Wall Marathon',
      location: 'China',
      category: 'Running',
      hasAccess: true,
    },
    {
      eventId: '3',
      name: 'The Color Run',
      location: 'United States',
      category: 'Running',
      hasAccess: true,
    },
    {
      eventId: '4',
      name: 'The Great Barrier Reef Marathon Festival',
      location: 'Australia',
      category: 'Running',
      hasAccess: false,
    },
    {
      eventId: '5',
      name: 'The Great Wall Marathon',
      location: 'China',
      category: 'Running',
      hasAccess: false,
    }    
  ];

  constructor(private readonly modalController: ModalController) {}

  async showPopupMenu(eventName: string, eventId: string) {
    const modal = await this.modalController.create({
      component: ViewEventModalComponent,
      componentProps: {
        eventName: eventName,
        evventId: eventId,
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
  }

  async showRequestAccessMenu(eventName: string, eventId: string) {
    const modal = await this.modalController.create({
      component: RequestAccessModalComponent,
      componentProps: {
        eventName: eventName,
        eventId: eventId,
      },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
  }
}
