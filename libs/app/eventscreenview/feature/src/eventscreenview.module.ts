import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventScreenViewRoutingModule } from './eventscreenview.routing';
import { EventScreenViewPage } from './eventscreenview.page';
import { EventScreenViewModule as EventScreenViewDataAccessModule } from '@event-participation-trends/app/eventscreenview/data-access';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@event-participation-trends/app/shared/feature';


@NgModule({
  declarations: [EventScreenViewPage],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    EventScreenViewRoutingModule,
    EventScreenViewDataAccessModule
  ]
})
export class EventScreenViewModule { }
