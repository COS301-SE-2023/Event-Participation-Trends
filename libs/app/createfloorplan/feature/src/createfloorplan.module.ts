import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateFloorPlanModule as CreateFloorPlanDataAccessModule } from '@event-participation-trends/app/createfloorplan/data-access';
import { CreateFloorPlanRoutingModule } from './createfloorplan.routing';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@event-participation-trends/app/shared/feature';
import { CreateFloorPlanPage } from './createfloorplan.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [CreateFloorPlanPage],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    CreateFloorPlanRoutingModule,
    CreateFloorPlanDataAccessModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CreateFloorPlanModule { }
