import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComparingeventsRoutingModule } from './comparingevents.routing';
import { ComparingeventsPage } from './comparingevents.page';
import { ComparingeventsModule as ComparingeventsDataAccessModule } from '@event-participation-trends/app/comparingevents/data-access';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ComparingeventsPage],
  imports: [
    CommonModule,
    ComparingeventsRoutingModule,
    ComparingeventsDataAccessModule,
    IonicModule
  ]
})
export class ComparingeventsModule { }
