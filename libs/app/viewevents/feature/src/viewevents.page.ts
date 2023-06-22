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

  public all_events: any[] = [];
  public subscribed_events: any[] = [];

  public my_events: any[] = [];

  hasEvents(): boolean {
    return true;
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
}
