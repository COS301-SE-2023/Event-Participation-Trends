import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventScreenViewRoutingModule } from './eventscreenview.routing';
import { EventScreenViewPage } from './eventscreenview.page';
import { EventScreenViewModule as EventScreenViewDataAccessModule } from '@event-participation-trends/app/eventscreenview/data-access';


@NgModule({
  declarations: [EventScreenViewPage],
  imports: [
    CommonModule,
    EventScreenViewRoutingModule,
    EventScreenViewDataAccessModule
  ]
})
export class EventScreenViewModule { }
