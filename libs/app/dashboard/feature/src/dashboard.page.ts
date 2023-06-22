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

interface IAccessRequest {
  userId: string;
  email: string;
  role: string;
}

@Component({
  selector: 'event-participation-trends-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css'],
})
export class DashboardPage implements OnInit {
  @Select(DashboardState.dashboardStatistics) dashboardStatistics$!: Observable<DashboardStateModel | null>;
  @Select(AccessRequestsState.accessRequests) accessRequests$!: Observable<IAccessRequest[] | null>;
  @Select(DashboardState.eventData) eventData$!: Observable<{eventId: string, eventName: string} | null>;

  constructor(private modalController : ModalController, private route: ActivatedRoute, private router: Router, private readonly store: Store) { 

  }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      const id = params['id'];

      // TODO get event by id
      if (!id) {
        this.router.navigate(['/home']);
      }
    });

    // this.store.dispatch(new GetAccessRequests());
    // this.store.dispatch(new GetDashboardStatistics());
    console.log('dashboard page init');

    // For now we will load mock data for the access requests
    this.store.dispatch(new SetAccessRequests([
      {
        userId: 'jnskdjnceu1299',
        email: 'something@gmail.com',
        role: 'Manager'
      },
      {
        userId: 'sjdksjdbfhb2093',
        email: 'anything@gmail.com',
        role: 'Manager'
      },
      {
        userId: 'hhsbdchsuru2902',
        email: 'ideas@gmail.com',
        role: 'Manager'
      },
      {
        userId: 'sdhbsjfhbw1208',
        email: 'curious@gmail.com',
        role: 'Manager'
      }
    ]));

    // Get query params from URL
    this.route.queryParams.subscribe(params => {
      const eventId = params['eventId'] ? params['eventId'] : '';
      const eventName = params['eventName'];

      // Set state for the event
      this.store.dispatch(new SetEventData({ eventId, eventName }));
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
    let numRequests = 0;

    this.accessRequests$.subscribe((accessRequests) => {
      if (accessRequests) {
        numRequests = accessRequests.length;
      }
    });
    
    return numRequests;
  }
}
