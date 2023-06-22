import { Component } from '@angular/core';
import { RequestAccessModalComponent } from '@event-participation-trends/app/requestaccessmodal/feature';
import { ViewEventModalComponent } from '@event-participation-trends/app/vieweventmodal/feature';
import { ModalController } from '@ionic/angular';
import { AppApiService } from '@event-participation-trends/app/api';
import { IEvent } from '@nestjs/cqrs';

@Component({
  selector: 'event-participation-trends-viewevents',
  templateUrl: './viewevents.page.html',
  styleUrls: ['./viewevents.page.css'],
})
export class VieweventsPage {
  public all_events: IEvent[] = [];
  public subscribed_events: any[] = [];

  public my_events: any[] = [];

  constructor(private appApiService: AppApiService, private readonly modalController: ModalController) {
    this.appApiService.getAllEvents().then((events) => {
      this.all_events = events;
      this.subscribed_events = events;
    });

    this.appApiService.getManagedEvents().then((events) => {
      this.my_events = events;
      console.log(events);
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
  // Added to RequestAccess modal component
  // requestAccess(event: any) {
  //   this.appApiService.sendViewRequest({eventId: event._id}).then((status) => {
  //     console.log(status);
  //   });
  // }

  subscribedEvents(): any[] {
    return this.subscribed_events;
  }

  unsubscribedEvents(): any[] {
    // mock data with the following interface
    /* interface IEvent {
      StartDate?: Date | undefined | null;
      EndDate?: Date | undefined | null;
      Name?: string | undefined | null;
      Category?: string | undefined | null;
      Location?: IEventLocation | undefined | null;
      thisFloorLayout?: IFloorLayout | undefined | null;
      Stalls?: IStall[] | undefined | null;
      Sensors?: ISensor[] | undefined | null;
      Devices?: IDevice[] | undefined | null;
      BTIDtoDeviceBuffer?: ITEMP_DEVICE_TO_DT[] | undefined | null;
      TEMPBuffer?: ITEMP_DEVICE_BUFFER[] | undefined | null;
      Manager?: Types.ObjectId | undefined | null;
      Requesters?: Types.ObjectId[] | undefined | null;
      Viewers?: Types.ObjectId[] | undefined | null;
    } */

    return [
      {
        StartDate: new Date(),
        EndDate: new Date(),
        Name: "Event 1",
        Category: "Category 1",
        Location: {
          Name: "Location 1",
          Address: "Address 1",
          City: "City 1",
          State: "State 1",
          Zip: "Zip 1",
          Country: "Country 1",
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
    ];

    return this.all_events.filter((event) => {
      return !this.hasAccess(event);
    });
  }

}
