import { Component, OnInit } from '@angular/core';
import { AccessRequestsComponent } from '@event-participation-trends/app/accessrequests/feature';
import { ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DashboardState, DashboardStateModel } from '../../data-access/src/dashboard.state';
import { GetAccessRequests } from '@event-participation-trends/app/accessrequests/util';

@Component({
  selector: 'event-participation-trends-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css'],
})
export class DashboardPage implements OnInit {
  @Select(DashboardState.dashboardStatistics) dashboardStatistics$!: Observable<DashboardStateModel | null>;

  constructor(private modalController : ModalController, private readonly store: Store) { }

  ngOnInit(): void {
    // this.store.dispatch(new GetAccessRequests());
    // this.store.dispatch(new GetDashboardStatistics());
    console.log('dashboard page init');
  }

  async openAccessRequests() {
    const modal = await this.modalController.create({
      component: AccessRequestsComponent,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
  }

}
