import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessrequestsComponent } from './accessrequests.component';

const routes: Routes = [
  {
    path: '',
    pathMatch:'full',
    component: AccessrequestsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessrequestsRoutingModule { }
