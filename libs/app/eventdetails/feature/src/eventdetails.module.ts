import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventDetailsRoutingModule } from './eventdetails.routing';
import { EventDetailsPage } from './eventdetails.page';
import { EventDetailsModule as EventDetailsDataAccessModule } from '@event-participation-trends/app/eventdetails/data-access';


@NgModule({
  declarations: [EventDetailsPage],
  imports: [
    CommonModule,
    EventDetailsRoutingModule,
    EventDetailsDataAccessModule
  ]
})
export class EventDetailsModule { }
