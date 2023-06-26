import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerEventsRoutingModule } from './managerevents.routing';
import { ManagerEventsPage } from './managerevents.page';
import { ManagerEventsModule as ManagerEventsDataAccessModule } from '@event-participation-trends/app/managerevents/data-access';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [ManagerEventsPage],
  imports: [
    CommonModule,
    ManagerEventsRoutingModule,
    ManagerEventsDataAccessModule,
    IonicModule
  ]
})
export class ManagerEventsModule { }
