import { Component, OnInit } from '@angular/core';
import { AccessRequestsComponent } from '@event-participation-trends/app/accessrequests/feature';
import { ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DashboardState, DashboardStateModel } from '@event-participation-trends/app/dashboard/data-access';
import { GetAccessRequests, SetAccessRequests } from '@event-participation-trends/app/accessrequests/util';
import { AccessRequestsState } from '@event-participation-trends/app/accessrequests/data-access';
import { ActivatedRoute, Router } from '@angular/router';
import { SetEventData } from '@event-participation-trends/app/dashboard/util';
import { AppApiService } from '@event-participation-trends/app/api';

interface IAccessRequest {
  userId: string;
  email: string;
  role: string;
}

interface Event {
  _id?: string;
  date: string;
  name: string;
  location: string;
  category: string;
  hasAccess: boolean;
  startsAt: string;
  endsAt: string;
}

@Component({
  selector: 'event-participation-trends-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css'],
})
export class DashboardPage implements OnInit {
  @Select(DashboardState.dashboardStatistics) dashboardStatistics$!: Observable<DashboardStateModel | null>;
  // @Select(AccessRequestsState.accessRequests) accessRequests$!: Observable<IAccessRequest[] | null>;
  @Select(DashboardState.eventData) eventData$!: Observable<{eventId: string, eventName: string} | null>;

  public event: Event = {
    _id: '648789728d8ed5b40edd0701',
    date: "2021-05-01",
    name: 'Polar Bear Plunge',
    location: 'Antarctica',
    category: 'Swimming',
    hasAccess: true,
    startsAt: '10:00',
    endsAt: '11:00',
  };

  public accessRequests: any[] = [];

  constructor(private modalController : ModalController, private route: ActivatedRoute, private router: Router, private readonly store: Store, private readonly appApiService: AppApiService) { 
    this.appApiService = appApiService;
    appApiService.getAccessRequests( {eventId : this.event._id} ).then((users) => {
      console.log('users', users);
      this.accessRequests = users;
    });
  }

  ngOnInit(): void {
    // this.store.dispatch(new GetAccessRequests());
    // this.store.dispatch(new GetDashboardStatistics());
    console.log('dashboard page init');

    // For now we will load mock data for the access requests
    this.store.dispatch(new SetAccessRequests(this.accessRequests));

    // Get query params from URL
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      const eventName = params['eventName'];

      // TODO get event by id - skip for now
      // if (!id) {
      //   this.router.navigate(['/home']);
      // }

      // Set state for the event
      this.store.dispatch(new SetEventData({ id, eventName }));
    });
  }

  async openAccessRequests() {
    const modal = await this.modalController.create({
      component: AccessRequestsComponent,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
  }

  get AccessRequestsLength() {
    return this.accessRequests.length;
  }
}
