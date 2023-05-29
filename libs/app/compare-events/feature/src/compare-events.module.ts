import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompareEventsRoutingModule } from './compare-events.routing';
import { CompareEventsPage } from './compare-events.page';
import { CompareEventsModule as CompareEventsDataAccessModule } from '@event-participation-trends/app/compare-events/data-access';

@NgModule({
  declarations: [CompareEventsPage],
  imports: [
    CommonModule,
    CompareEventsRoutingModule,
    CompareEventsDataAccessModule
  ]
})
export class CompareEventsModule { }
