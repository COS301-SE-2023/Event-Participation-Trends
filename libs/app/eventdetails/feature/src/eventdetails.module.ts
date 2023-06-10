import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventDetailsRoutingModule } from './eventdetails.routing';
import { EventDetailsPage } from './eventdetails.page';
import { EventDetailsModule as EventDetailsDataAccessModule } from '@event-participation-trends/app/eventdetails/data-access';
import { SharedModule } from '@event-participation-trends/app/shared/feature';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [EventDetailsPage],
  imports: [
    CommonModule,
    IonicModule,
    EventDetailsRoutingModule,
    EventDetailsDataAccessModule,
    SharedModule,
    FormsModule
  ]
})
export class EventDetailsModule { }
