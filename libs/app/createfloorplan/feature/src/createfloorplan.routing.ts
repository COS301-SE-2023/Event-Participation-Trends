import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateFloorPlanPage } from './createfloorplan.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CreateFloorPlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateFloorPlanRoutingModule { }
