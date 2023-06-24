import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEventPage } from './addevent.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AddEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEventRoutingModule { }
