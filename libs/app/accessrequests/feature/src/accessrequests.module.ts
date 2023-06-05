import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { AccessrequestsComponent } from './accessrequests.component';
import { AccessrequestsRoutingModule } from './accessrequests.routing';
import { AccessRequestsModule as AccessRequestsDataAccessModule } from '@event-participation-trends/app/accessrequests/data-access';

@NgModule({
  declarations: [AccessrequestsComponent],
  imports: [
    CommonModule,
    IonicModule,
    AccessrequestsRoutingModule,
    AccessRequestsDataAccessModule
  ]
})
export class AccessRequestsModule { }
