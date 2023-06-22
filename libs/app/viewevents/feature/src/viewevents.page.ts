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
    return this.all_events.filter((event) => {
      return !this.hasAccess(event);
    });
  }

}
