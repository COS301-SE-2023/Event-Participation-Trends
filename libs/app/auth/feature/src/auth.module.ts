import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthModule as AuthDataAccessModule } from '@event-participation-trends/app/auth/data-access';

@NgModule({
  imports: [
    CommonModule,
    AuthDataAccessModule
  ],
})
export class AuthModule {}
