import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventFullViewPage } from './event-full-view.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: EventFullViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventFullViewRoutingModule { }
