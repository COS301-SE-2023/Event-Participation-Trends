import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsermanagementPage } from './usermanagement.page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: UsermanagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsermanagementRoutingModule { }
