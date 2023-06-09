import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard.routing';
import { DashboardPage } from './dashboard.page';
import { DashboardModule as DashboardDataAccessModule } from '@event-participation-trends/app/dashboard/data-access';
import { IonicModule } from '@ionic/angular';
import { AccessRequestsModule } from '@event-participation-trends/app/accessrequests/feature';
import { SharedModule } from '@event-participation-trends/app/shared/feature';

@NgModule({
  declarations: [DashboardPage],
  imports: [
    CommonModule,
    IonicModule,
    DashboardRoutingModule,
    DashboardDataAccessModule,
    AccessRequestsModule,
    SharedModule
  ]
})
export class DashboardModule { }
