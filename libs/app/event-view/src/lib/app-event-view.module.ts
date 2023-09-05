import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { appEventViewRoutes } from './lib.routes';
import { EventViewComponent } from './event-view/event-view.component';
import { DashboardPageComponent, EventDetailsPageComponent, EventHelpComponent, SmallScreenModalComponent } from '@event-participation-trends/app/components';
import { NgIconsModule } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroChartBar,
  heroPencil,
} from '@ng-icons/heroicons/outline';
import {
  matFormatListBulletedRound,
  matBarChartRound,
  matDrawRound,
  matQuestionMarkRound,
} from '@ng-icons/material-icons/round';
import { matMenu, matClose } from '@ng-icons/material-icons/baseline';

@NgModule({
  bootstrap: [EventViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(appEventViewRoutes),
    RouterModule,
    DashboardPageComponent,
    EventHelpComponent,
    EventDetailsPageComponent,
    SmallScreenModalComponent,
    NgIconsModule.withIcons({
      heroArrowLeft,
      heroChartBar,
      heroPencil,
      matFormatListBulletedRound,
      matBarChartRound,
      matDrawRound,
      matQuestionMarkRound,
      matMenu,
      matClose
    }),
  ],
  declarations: [EventViewComponent],
})
export class AppEventViewModule {}
