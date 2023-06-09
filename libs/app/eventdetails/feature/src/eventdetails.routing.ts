import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventDetailsPage } from './eventdetails.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: EventDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventDetailsRoutingModule { }
