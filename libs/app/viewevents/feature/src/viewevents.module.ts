import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VieweventsRoutingModule } from './viewevents.routing';
import { VieweventsPage } from './viewevents.page';
import { VieweventsModule as VieweventsDataAccessModule } from '@event-participation-trends/app/viewevents/data-access';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [VieweventsPage],
  imports: [
    CommonModule,
    IonicModule,
    VieweventsRoutingModule,
    VieweventsDataAccessModule,
    FormsModule
  ]
})
export class VieweventsModule { }
