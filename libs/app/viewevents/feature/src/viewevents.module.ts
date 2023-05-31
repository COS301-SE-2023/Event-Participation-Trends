import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VieweventsRoutingModule } from './viewevents.routing';
import { VieweventsPage } from './viewevents.page';
import { VieweventsModule as VieweventsDataAccessModule } from '@event-participation-trends/app/viewevents/data-access';

@NgModule({
  declarations: [VieweventsPage],
  imports: [
    CommonModule,
    VieweventsRoutingModule,
    VieweventsDataAccessModule
  ]
})
export class VieweventsModule { }
