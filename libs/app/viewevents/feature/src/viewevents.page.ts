import { Component } from '@angular/core';
import { RequestAccessModalComponent } from '@event-participation-trends/app/requestaccessmodal/feature';
import { ViewEventModalComponent } from '@event-participation-trends/app/vieweventmodal/feature';
import { ModalController, NavController } from '@ionic/angular';
import { AppApiService } from '@event-participation-trends/app/api';
import { IEvent, IGetManagedEventsResponse } from '@event-participation-trends/api/event/util';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'event-participation-trends-viewevents',
  templateUrl: './viewevents.page.html',
  styleUrls: ['./viewevents.page.css'],
})
export class VieweventsPage {
  public all_events: any[] = [];
  public subscribed_events: any[] = [];
  public unsubscribed_events: any[] = [];
  public my_events: any[] = [];
  public role = 'Viewer';
  public searchValue = '';
  public address_location = '';

  constructor(
    private appApiService: AppApiService,
    private readonly modalController: ModalController,
    private readonly navController: NavController
  ) {
    // get role
    this.appApiService.getRole().subscribe((role) => {
      this.role = role.userRole ? role.userRole : 'Viewer';

      let my_events_request : Observable<IGetManagedEventsResponse>;

      if (this.role === 'admin') {
        this.appApiService.getAllEvents().subscribe((response) => {
          this.my_events = response.events;
        })

        return;
      }
      
      if (this.role === 'manager') {
        my_events_request = this.appApiService.getManagedEvents();
      }else {
        my_events_request = new Observable((observer) => {
          observer.next({
            events: []
          });
          setTimeout(() => {
            observer.complete();
          })
        });
      }

      forkJoin([my_events_request, this.appApiService.getAllEvents(), this.appApiService.getSubscribedEvents()]).subscribe((response) => {
        const my_events = response[0].events;
        const all_events = response[1].events;
        const subscribed_events = response[2].events;

        this.my_events = my_events;
        this.all_events = all_events;

        this.subscribed_events = subscribed_events.filter((event: any) => {
          // event is not in my_events
          return (
            this.my_events.filter((my_event) => {
              return my_event._id == event._id;
            }).length == 0
          );
        });

        // Set unsubscribed events
        this.unsubscribed_events = all_events.filter((event: any) => {
          return (
            !this.hasAccess(event) &&
            this.my_events.filter((my_event) => {
              return my_event._id == event._id;
            }).length == 0
          );
        });
      })

    });
  }

  async showPopupMenu(event: any) {
    const modal = await this.modalController.create({
      component: ViewEventModalComponent,
      componentProps: {
        event: event,
      },
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

  myEventsTitle(): boolean {
    return this.role === 'manager';
  }

  allEventsTitle(): boolean {
    return this.all_events.length > 0 && this.role === 'manager';
  }

  requestAccess(event: any) {
    this.appApiService.sendViewRequest(event._id);
  }

  managedEvents(): any[] {
    return this.my_events.filter((event) => {
      return event.Name
        ? event.Name.toLowerCase().includes(this.searchValue.toLowerCase())
        : false;
    });
  }

  subscribedEvents(): any[] {
    return this.subscribed_events.filter((event) => {
      return event.Name
        ? event.Name.toLowerCase().includes(this.searchValue.toLowerCase())
        : false;
    });
  }

  unsubscribedEvents(): any[] {
    return this.unsubscribed_events.filter((event) => {
      return event.Name
        ? event.Name.toLowerCase().includes(this.searchValue.toLowerCase())
        : false;
    });
  }

  getLocation(event: any): string {
    this.address_location = '';
    if (event.Location.StreetName) {
      this.address_location += event.Location.StreetName;
    }
    
    return this.address_location;
  }

  openEventScreenView(event: any) {
    this.navController.navigateForward('/eventscreenview', { queryParams: {id: event._id, queryParamsHandling: 'merge' } });
  }
}
