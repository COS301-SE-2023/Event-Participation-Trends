import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewEventModalComponent } from './vieweventmodal.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ViewEventModalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VieweventmodalRoutingModule { }
