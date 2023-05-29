import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewEventsRoutingModule } from './view-events.routing';
import { ViewEventsPage } from './view-events.page';
import { ViewEventsModule as ViewEventsDataAccessModule } from '@event-participation-trends/app/view-events/data-access';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ViewEventsRoutingModule,
    ViewEventsDataAccessModule
  ]
})
export class ViewEventsModule { }
