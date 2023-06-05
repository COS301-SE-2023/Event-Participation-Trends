import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { DashboardRoutingModule } from './dashboard.routing';
import { DashboardModule as DashboardDataAccessModule } from '@event-participation-trends/app/dashboard/data-access';
import { IonicModule } from '@ionic/angular';
import { AccessrequestsComponent } from './accessrequests.component';
import { AccessrequestsRoutingModule } from './accessrequests.routing';

@NgModule({
  declarations: [AccessrequestsComponent],
  imports: [
    CommonModule,
    IonicModule,
    AccessrequestsRoutingModule,
    DashboardDataAccessModule
  ]
})
export class DashboardModule { }
