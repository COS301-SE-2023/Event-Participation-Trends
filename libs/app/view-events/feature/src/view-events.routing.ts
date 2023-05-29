import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewEventsPage } from './view-events.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ViewEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewEventsRoutingModule { }
