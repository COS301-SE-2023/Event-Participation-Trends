import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventScreenViewPage } from './eventscreenview.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: EventScreenViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventScreenViewRoutingModule { }
