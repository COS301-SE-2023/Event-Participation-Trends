import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { appEventViewRoutes } from './lib.routes';
import { EventViewComponent } from './event-view/event-view.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(appEventViewRoutes),
    RouterModule,
  ],
  declarations: [EventViewComponent],
})
export class AppEventViewModule {}
