import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FloorEditorPage } from './flooreditor.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: FloorEditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FloorEditorRoutingModule { }
