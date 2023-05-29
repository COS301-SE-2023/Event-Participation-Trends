import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompareEventsPage } from './compare-events.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CompareEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompareEventsRoutingModule { }
