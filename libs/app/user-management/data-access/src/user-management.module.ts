import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { UserManagementState } from './user-management.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([UserManagementState])],
})
export class UserManagementModule {}