import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEventRoutingModule } from './addevent.routing';
import { AddEventModule as AddEventDataAccessModule } from '@event-participation-trends/app/addevent/data-access';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@event-participation-trends/app/shared/feature';
import { FormsModule } from '@angular/forms';
import { AddEventPage } from './addevent.page';


@NgModule({
  declarations: [AddEventPage],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    AddEventRoutingModule,
    AddEventDataAccessModule,
    FormsModule
  ]
})
export class AddEventModule { }
