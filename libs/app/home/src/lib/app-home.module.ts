import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { appHomeRoutes } from './lib.routes';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from '@event-participation-trends/app/components';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(appHomeRoutes), RouterModule, ProfileComponent],
  declarations: [HomeComponent],
})
export class AppHomeModule {}
