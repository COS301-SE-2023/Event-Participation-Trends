import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { appHomeRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(appHomeRoutes), RouterModule],
})
export class AppHomeModule {}
