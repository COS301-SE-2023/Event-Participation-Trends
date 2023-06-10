import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { UsermanagementState } from './usermanagement.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([UsermanagementState])],
})
export class UsermanagementModule {}
