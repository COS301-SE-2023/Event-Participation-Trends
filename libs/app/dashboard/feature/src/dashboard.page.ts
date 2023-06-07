import { Component } from '@angular/core';
import { AccessRequestsComponent } from '@event-participation-trends/app/accessrequests/feature';
import { ModalController } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { DashboardState } from '../../data-access/src/dashboard.state';

@Component({
  selector: 'event-participation-trends-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css'],
})
export class DashboardPage {
  // @Select(DashboardState.dashboardStatistics) dashboardStatistics$!: any[];

  constructor(private modalController : ModalController) { }

  async openAccessRequests() {
    const modal = await this.modalController.create({
      component: AccessRequestsComponent,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
  }

}
