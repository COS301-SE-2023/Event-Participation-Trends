import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { appEventViewRoutes } from './lib.routes';
import { EventViewComponent } from './event-view/event-view.component';
import { DashboardPageComponent, EventDetailsPageComponent } from '@event-participation-trends/app/components';
import { NgIconsModule } from '@ng-icons/core';
import { heroArrowLeft, heroChartBar, heroPencil } from '@ng-icons/heroicons/outline';
import { matFormatListBulletedRound, matBarChartRound, matDrawRound } from '@ng-icons/material-icons/round';

@NgModule({
  bootstrap: [EventViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(appEventViewRoutes),
    RouterModule,
    DashboardPageComponent,
    EventDetailsPageComponent,
    NgIconsModule.withIcons({heroArrowLeft, heroChartBar, heroPencil, matFormatListBulletedRound, matBarChartRound, matDrawRound})
  ],
  declarations: [EventViewComponent],
})
export class AppEventViewModule {}
