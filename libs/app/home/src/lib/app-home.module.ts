import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { appHomeRoutes } from './lib.routes';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(appHomeRoutes), RouterModule],
  declarations: [HomeComponent],
})
export class AppHomeModule {}
