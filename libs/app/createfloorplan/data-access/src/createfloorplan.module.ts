import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { CreateFloorPlanState } from './createfloorplan.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([CreateFloorPlanState])],
})
export class CreateFloorPlanModule {}
