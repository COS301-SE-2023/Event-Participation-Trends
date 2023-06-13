import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEventRoutingModule } from './addevent.routing';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@event-participation-trends/app/shared/feature';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    AddEventRoutingModule,
    FormsModule
  ]
})
export class AddEventModule { }
