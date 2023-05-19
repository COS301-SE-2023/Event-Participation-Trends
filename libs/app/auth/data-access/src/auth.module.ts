import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AuthApi } from './auth.api';
import { AuthState } from './auth.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([AuthState])],
  providers: [AuthApi],
})
export class AuthModule {}
