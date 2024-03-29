import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { appHomeRoutes } from './lib.routes';
import { HomeComponent } from './home/home.component';
import { ProfileComponent, HomeHelpComponent, SmallScreenModalComponent } from '@event-participation-trends/app/components';
import {
  AllEventsPageComponent,
  ComparePageComponent,
  UsersPageComponent,
} from '@event-participation-trends/app/components';
import { NgIconsModule } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroChartBar,
  heroPencil,
  heroArrowsRightLeft,
} from '@ng-icons/heroicons/outline';
import {
  matFormatListBulletedRound,
  matBarChartRound,
  matDrawRound,
  matQuestionMarkRound,
  matGroupRound,
  matEventRound,
  matCompareArrowsRound,
} from '@ng-icons/material-icons/round';

import {
  matMenu,
  matClose
} from '@ng-icons/material-icons/baseline';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(appHomeRoutes),
    RouterModule,
    ProfileComponent,
    HomeHelpComponent,
    AllEventsPageComponent,
    ComparePageComponent,
    UsersPageComponent,
    NgIconsModule.withIcons({
      heroArrowLeft,
      heroChartBar,
      heroPencil,
      matFormatListBulletedRound,
      matBarChartRound,
      matDrawRound,
      matQuestionMarkRound,
      matGroupRound,
      matEventRound,
      matCompareArrowsRound,
      heroArrowsRightLeft,
      matMenu,
      matClose
    }),
  ],
  declarations: [HomeComponent],
  bootstrap: [HomeComponent],
})
export class AppHomeModule {}
