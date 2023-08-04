import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { appEventViewRoutes } from './lib.routes';
import { EventViewComponent } from './event-view/event-view.component';
import { DashboardPageComponent, EventDetailsPageComponent } from '@event-participation-trends/app/components';

@NgModule({
  bootstrap: [EventViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(appEventViewRoutes),
    RouterModule,
  ],
  declarations: [EventViewComponent],
})
export class AppEventViewModule {}
