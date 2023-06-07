import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard.routing';
import { DashboardPage } from './dashboard.page';
import { DashboardModule as DashboardDataAccessModule } from '@event-participation-trends/app/dashboard/data-access';
import { IonicModule } from '@ionic/angular';
import { SubPageNavPage } from '@event-participation-trends/app/subpagenav/feature';

@NgModule({
  declarations: [DashboardPage, SubPageNavPage],
  imports: [
    CommonModule,
    IonicModule,
    DashboardRoutingModule,
    DashboardDataAccessModule
  ]
})
export class DashboardModule { }
