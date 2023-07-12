import { Component, OnInit } from '@angular/core';
import { RequestAccessModalComponent } from '@event-participation-trends/app/requestaccessmodal/feature';
import { ViewEventModalComponent } from '@event-participation-trends/app/vieweventmodal/feature';
import { ModalController, NavController } from '@ionic/angular';
import { AppApiService } from '@event-participation-trends/app/api';
import { IEvent, IGetManagedEventsResponse } from '@event-participation-trends/api/event/util';
import { Observable, forkJoin } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { VieweventsState } from '@event-participation-trends/app/viewevents/data-access';
import { GetAllEvents, GetMyEvents, GetRole, GetSubscribedEvents, GetUnsubscribedEvents, SetMyEvents } from '@event-participation-trends/app/viewevents/util';

@Component({
  selector: 'event-participation-trends-viewevents',
  templateUrl: './viewevents.page.html',
  styleUrls: ['./viewevents.page.css'],
})
export class VieweventsPage implements OnInit{
  @Select(VieweventsState.all_events) all_events$!: Observable<IEvent[] | undefined>;
  @Select(VieweventsState.subscribed_events) subscribed_events$!: Observable<IEvent[] | undefined>;
  @Select(VieweventsState.unsubscribed_events) unsubscribed_events$!: Observable<IEvent[] | undefined>;
  @Select(VieweventsState.my_events) my_events$!: Observable<IEvent[] | undefined>;
  @Select(VieweventsState.role) role$!: Observable<string | undefined>;
  @Select(VieweventsState.searchValue) searchValue$!: Observable<string | undefined>;

  public all_events: any[] = [];
  public subscribed_events: any[] = [];
  public unsubscribed_events: any[] = [];
  public my_events: any[] = [];
  public role = 'Viewer';
  public searchValue = '';
  public address_location = '';
  isLoading = true;

  constructor(
    private appApiService: AppApiService,
    private readonly modalController: ModalController,
    private readonly navController: NavController,
    private readonly router: Router,
    private store: Store
  ) {
    // // get role
    // this.appApiService.getRole().subscribe((role) => {
    //   this.role = role.userRole ? role.userRole : 'Viewer';
      
    //   let my_events_request : Observable<IGetManagedEventsResponse>;
      
    //   if (this.role === 'admin') {
    //     this.appApiService.getAllEvents().subscribe((response) => {
    //       this.my_events = response.events;
    //     })
        
    //     return;
    //   }
      
    //   if (this.role === 'manager') {
    //     my_events_request = this.appApiService.getManagedEvents();
    //   }else {
    //     my_events_request = new Observable((observer) => {
    //       observer.next({
    //         events: []
    //       });
    //       setTimeout(() => {
    //         observer.complete();
    //       })
    //     });
    //   }
      
    //   forkJoin([my_events_request, this.appApiService.getAllEvents(), this.appApiService.getSubscribedEvents()]).subscribe((response) => {
    //     const my_events = response[0].events;
    //     const all_events = response[1].events;
    //     const subscribed_events = response[2].events;

    //     this.my_events = my_events;
    //     this.all_events = all_events;

    //     this.subscribed_events = subscribed_events.filter((event: any) => {
    //       // event is not in my_events
    //       return (
    //         this.my_events.filter((my_event) => {
    //           return my_event._id == event._id;
    //         }).length == 0
    //       );
    //     });

    //     // Set unsubscribed events
    //     this.unsubscribed_events = all_events.filter((event: any) => {
    //       return (
    //         !this.hasAccess(event) &&
    //         this.my_events.filter((my_event) => {
    //           return my_event._id == event._id;
    //         }).length == 0
    //       );
    //     });
    //   })

    // });
  }

  ngOnInit() {
    // set isLoading to false after 3 seconds
    setTimeout(() => {
      this.store.dispatch(new GetRole());
      this.store.dispatch(new GetAllEvents());

      this.all_events$.subscribe((all_events) => {
        this.all_events = all_events ? all_events : [];
      });

      this.role$.subscribe((role) => {
        this.role = role ? role : 'Viewer';

        let my_events_request: Observable<IGetManagedEventsResponse>;

        if (this.role === 'admin') {
          this.all_events$.subscribe((all_events) => {
            this.my_events = all_events ? all_events : [];
          });
          return;
        }

        if (this.role === 'manager') {
          this.store.dispatch(new GetMyEvents());

          this.my_events$.subscribe((my_events) => {
            this.my_events = my_events ? my_events : [];
          });
        } else {
          my_events_request = new Observable((observer) => {
            observer.next({
              events: [],
            });
            setTimeout(() => {
              observer.complete();
            })
          });

          my_events_request.subscribe((my_events) => {
            this.my_events = my_events.events ? my_events.events : [];

            // set my events
            this.store.dispatch(new SetMyEvents(this.my_events));
          });
        }

        this.store.dispatch(new GetSubscribedEvents());

        this.subscribed_events$.subscribe((subscribed_events) => {
          this.subscribed_events = subscribed_events ? subscribed_events : [];

          this.subscribed_events = this.subscribed_events?.filter((event: any) => {
            // event is not in my_events
            return (
              this.my_events.filter((my_event) => {
                return my_event._id == event._id;
              }).length == 0
            );
          });
          this.store.dispatch(new GetUnsubscribedEvents());
    
          this.unsubscribed_events$.subscribe((unsubscribed_events) => {
            this.unsubscribed_events = unsubscribed_events ? unsubscribed_events : [];
          });
        });
      });

      this.isLoading = false;
    }, 1000);
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

  managerUp(): boolean {
    return this.role === 'manager' || this.role === 'admin';
  }

  allEventsTitle(): boolean {
    return this.all_events.length > 0 && this.role === 'manager';
  }

  get allEventsLength(): number {
    return this.all_events.length;
  }

  requestAccess(event: any) {
    this.appApiService.sendViewRequest(event._id);
  }

  managedEvents(): any[] {
    // return this.my_events.filter((event) => {
    //   return event.Name
    //     ? event.Name.toLowerCase().includes(this.searchValue.toLowerCase())
    //     : false;
    // });
    this.my_events = [];

    this.my_events$.subscribe((my_events) => {
      this.my_events = my_events ? my_events : [];
    });

    return this.my_events.filter((event) => {
      return event.Name
        ? event.Name.toLowerCase().includes(this.searchValue.toLowerCase())
        : false;
    });
  }

  subscribedEvents(): any[] {
    // return this.subscribed_events.filter((event) => {
    //   return event.Name
    //     ? event.Name.toLowerCase().includes(this.searchValue.toLowerCase())
    //     : false;
    // });
    this.subscribed_events = [];

    this.subscribed_events$.subscribe((subscribed_events) => {
      this.subscribed_events = subscribed_events ? subscribed_events : [];
    });

    return this.subscribed_events.filter((event) => {
      return event.Name
        ? event.Name.toLowerCase().includes(this.searchValue.toLowerCase())
        : false;
    });
  }

  unsubscribedEvents(): any[] {
    // return this.unsubscribed_events.filter((event) => {
    //   return event.Name
    //     ? event.Name.toLowerCase().includes(this.searchValue.toLowerCase())
    //     : false;
    // });
    this.unsubscribed_events = [];

    this.unsubscribed_events$.subscribe((unsubscribed_events) => {
      this.unsubscribed_events = unsubscribed_events ? unsubscribed_events : [];
    });

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

  getMyEventsLength(): number {
    let num = 0;

    this.my_events$.subscribe((my_events) => {
      num = my_events ? my_events.length : 0;
    });

    return num;
  }

  // openEventScreenView(event: any) {
  //   this.navController.navigateForward('/eventscreenview', { queryParams: {id: event._id, queryParamsHandling: 'merge' } });
  // }

  openEventDetails(event: any) {
    this.navController.navigateForward('/event/eventdetails', { queryParams: {m: true, id: event._id, queryParamsHandling: 'merge' } });
  }

  openEvent(event: any) {
    const isMyEvent = this.my_events.filter((my_event) => {
      return my_event._id == event._id;
    }).length > 0;

    const queryParams: NavigationExtras = {
      queryParams: {
        m: isMyEvent || this.role === 'admin' ? true : false,
        id: event._id,
        queryParamsHandling: 'merge',
      },
    };

    this.router.navigate(['/event/dashboard'], queryParams);
  }

  openAddEventPage() {
    const queryParams: NavigationExtras = {
      queryParams: {
        // id: this.
        queryParamsHandling: 'merge',
      },
    };

    this.router.navigate(['/event/addevent'], queryParams);
  }

  hasFloorLayout(event: any): boolean {
    return event.FloorLayout ? true : false;
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.store.dispatch(new GetAllEvents());
      this.store.dispatch(new GetMyEvents());
      this.store.dispatch(new GetSubscribedEvents());
      this.store.dispatch(new GetUnsubscribedEvents());
      
      event.target.complete();
    }, 2000);
  }
}
