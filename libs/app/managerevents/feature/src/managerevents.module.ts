import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerEventsRoutingModule } from './managerevents.routing';
import { ManagerEventsPage } from './managerevents.page';
import { ManagerEventsModule as ManagerEventsDataAccessModule } from '@event-participation-trends/app/managerevents/data-access';


@NgModule({
  declarations: [ManagerEventsPage],
  imports: [
    CommonModule,
    ManagerEventsRoutingModule,
    ManagerEventsDataAccessModule
  ]
})
export class ManagerEventsModule { }
