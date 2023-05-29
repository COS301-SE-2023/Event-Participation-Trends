import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management.routing';
import { UserManagementPage } from './user-management.page';
import { UserManagementModule as UserManagementDataAccessModule } from '@event-participation-trends/app/user-management/data-access';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    UserManagementDataAccessModule
  ]
})
export class UserManagementModule { }
