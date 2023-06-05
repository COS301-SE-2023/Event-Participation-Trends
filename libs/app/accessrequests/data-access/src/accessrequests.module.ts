import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
// import { DashboardState } from './dashboard.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([])],
})
export class DashboardModule {}