import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsermanagementRoutingModule } from './usermanagement.routing';
import { UsermanagementPage } from './usermanagement.page';
import { UsermanagementModule as UsermanagementDataAccessModule } from '@event-participation-trends/app/usermanagement/data-access';


@NgModule({
  declarations: [UsermanagementPage],
  imports: [
    CommonModule,
    UsermanagementRoutingModule,
    UsermanagementDataAccessModule
  ]
})
export class UsermanagementModule { }