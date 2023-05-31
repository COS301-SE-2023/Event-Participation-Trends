import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VieweventsPage } from './viewevents.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: VieweventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VieweventsRoutingModule { }
