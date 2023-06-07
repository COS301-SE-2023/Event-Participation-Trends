import { Component, OnInit } from '@angular/core';
import { AccessRequestsComponent } from '@event-participation-trends/app/accessrequests/feature';
import { ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DashboardState, DashboardStateModel } from '../../data-access/src/dashboard.state';
import { GetAccessRequests, SetAccessRequests } from '@event-participation-trends/app/accessrequests/util';
import { AccessRequestsState } from '@event-participation-trends/app/accessrequests/data-access';

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

  constructor(private modalController : ModalController, private readonly store: Store) { }

  ngOnInit(): void {
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
  }

  async openAccessRequests() {
    const modal = await this.modalController.create({
      component: AccessRequestsComponent,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
  }

  get AccessRequestsLength() {
    this.accessRequests$.subscribe((accessRequests) => {
      if (accessRequests) {
        return accessRequests.length;
      }
      return 0;
    });
    
    return 0;
  }
}
