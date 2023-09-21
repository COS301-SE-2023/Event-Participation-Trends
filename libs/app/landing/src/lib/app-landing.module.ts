import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { NgIconsModule } from '@ng-icons/core';
import { heroHome } from '@ng-icons/heroicons/outline';
import { RouterLink } from '@angular/router';
import { ProfileComponent } from '@event-participation-trends/app/components';

@NgModule({
  imports: [CommonModule, NgIconsModule.withIcons({heroHome}), RouterLink, ProfileComponent],
  declarations: [LandingComponent],
  exports: [LandingComponent],
})
export class AppLandingModule {}
