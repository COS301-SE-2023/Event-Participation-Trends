import { Component } from '@angular/core';
import { RequestAccessModalComponent } from '@event-participation-trends/app/requestaccessmodal/feature';
import { ViewEventModalComponent } from '@event-participation-trends/app/vieweventmodal/feature';
import { ModalController } from '@ionic/angular';
import { AppApiService } from '@event-participation-trends/app/api';
import {IEvent} from '@event-participation-trends/api/event/util';

@Component({
  selector: 'event-participation-trends-viewevents',
  templateUrl: './viewevents.page.html',
  styleUrls: ['./viewevents.page.css'],
})
export class VieweventsPage {
  public subscribed_events: any[] = [];
  public unsubscribed_events: any[] = [];
  public my_events: any[] = [];

  public searchValue = '';

  constructor(private appApiService: AppApiService, private readonly modalController: ModalController) {
    this.appApiService.getAllEvents().then((events) => {
      this.subscribed_events = events;
      this.unsubscribed_events = events.filter((event) => {
        return !this.hasAccess(event);
      });
      this.unsubscribed_events.push(
        {
          StartDate: new Date(),
          EndDate: new Date(),
          Name: "Event 1",
          Category: "Category 1",
          Location: {
            Latitude: 0,
            Longitude: 0,
            StreetName: "Street 1",
            CityName: "City 1",
            ProvinceName: "Province 1",
            CountryName: "Country 1",
            ZIPCode: "ZIP 1",
          },
          thisFloorLayout: null,
          Stalls: null,
          Sensors: null,
          Devices: null,
          BTIDtoDeviceBuffer: null,
          TEMPBuffer: null,
          Manager: null,
          Requesters: null,
          Viewers: null,
        },
      );
    });

    this.appApiService.getManagedEvents().then((events) => {
      this.my_events = events;
    });

  }

  async showPopupMenu(eventName: string) {
    const modal = await this.modalController.create({
      component: ViewEventModalComponent,
      componentProps: {
        eventName: eventName,
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
  }

  async showRequestAccessMenu(event: any) {
    const modal = await this.modalController.create({
      component: RequestAccessModalComponent,
      componentProps: {
        event: event,
      },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
  }

  hasEvents(): boolean {
    return this.my_events.length > 0;
  }

  hasAccess(event: any): boolean {

    for (let i = 0; i < this.subscribed_events.length; i++) {
      if (this.subscribed_events[i]._id == event._id) {
        return true;
      }
    }

    return false;
  }

  managedEvents(): any[] {
    return this.my_events.filter((event) => {
      return event.Name ? event.Name.toLowerCase().includes(this.searchValue.toLowerCase()) : false;
    });
  };

  subscribedEvents(): any[] {
    return this.subscribed_events.filter((event) => {
      return event.Name ? event.Name.toLowerCase().includes(this.searchValue.toLowerCase()) : false;
    });
  }

  unsubscribedEvents(): any[] {
    return this.unsubscribed_events.filter((event) => {
      return event.Name ? event.Name.toLowerCase().includes(this.searchValue.toLowerCase()) : false;
    });
  }

}
