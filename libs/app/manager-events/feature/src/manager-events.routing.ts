import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerEventsPage } from './manager-events.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ManagerEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerEventsRoutingModule { }
